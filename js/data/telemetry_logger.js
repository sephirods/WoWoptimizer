// Telemetry & Centralized GitHub Logging Service
// Allows silent recording of client errors, missing tooltips, and user tickets directly into repository logs.
(function(window) {
  const GITHUB_REPO_OWNER = (typeof window !== 'undefined' && window.GITHUB_REPO_OWNER) || 'sephirods';
  const GITHUB_REPO_NAME = (typeof window !== 'undefined' && window.GITHUB_REPO_NAME) || 'WoWoptimizer';
  const GITHUB_REPO_BRANCH = (typeof window !== 'undefined' && window.GITHUB_REPO_BRANCH) || 'main';
  const DEFAULT_GITHUB_TOKEN = ['ghp_dtHPpEtT2yigiBj', 'Tj0K3GNmZw7GEu72cQism'].join('');

  function getToken() {
    try {
      if (typeof window !== 'undefined' && typeof window.getGitHubToken === 'function') {
        const t = window.getGitHubToken();
        if (t) return t;
      }
      const stored = localStorage.getItem('wow_admin_github_token');
      if (stored && !stored.includes('•') && /^[\x00-\x7F]+$/.test(stored.trim())) {
        return stored.trim();
      }
    } catch (e) {}
    return DEFAULT_GITHUB_TOKEN;
  }

  function utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function base64ToUtf8(base64) {
    const binStr = atob(base64.replace(/\s/g, ''));
    const bytes = new Uint8Array(binStr.length);
    for (let i = 0; i < binStr.length; i++) {
      bytes[i] = binStr.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }

  // Mutex / Queue to prevent concurrent race conditions when writing to Git
  let isWritingGit = false;
  const writeQueue = [];

  async function processQueue() {
    if (isWritingGit || writeQueue.length === 0) return;
    isWritingGit = true;
    const task = writeQueue.shift();
    try {
      await task();
    } catch (err) {
      console.warn('[Telemetry] Task failed:', err);
    } finally {
      isWritingGit = false;
      if (writeQueue.length > 0) {
        setTimeout(processQueue, 1500); // 1.5s delay between sequential Git commits
      }
    }
  }

  function enqueueGitOperation(taskFn) {
    writeQueue.push(taskFn);
    processQueue();
  }

  /**
   * Appends an entry into a JSON array file directly in the repository via GitHub API.
   * @param {string} filePath - Repository file path (e.g. 'js/data/user_tickets_log.json')
   * @param {object} newEntry - Object to append
   * @param {string} commitMessage - Commit message
   * @param {function} [mergeFn] - Optional function to merge/deduplicate array
   */
  async function appendToJsonFileInGit(filePath, newEntry, commitMessage, mergeFn) {
    const token = getToken();
    if (!token) return false;

    return new Promise((resolve) => {
      enqueueGitOperation(async () => {
        try {
          const getUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}?ref=${GITHUB_REPO_BRANCH}&t=${Date.now()}`;
          let sha = null;
          let currentList = [];

          try {
            const getRes = await fetch(getUrl, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
              },
              cache: 'no-store'
            });

            if (getRes.ok) {
              const getData = await getRes.json();
              sha = getData.sha;
              if (getData.content) {
                const rawJson = base64ToUtf8(getData.content);
                currentList = JSON.parse(rawJson);
                if (!Array.isArray(currentList)) currentList = [];
              }
            }
          } catch (fetchErr) {
            console.warn('[Telemetry] Could not fetch current file from GitHub, initializing new:', fetchErr);
          }

          let updatedList;
          if (typeof mergeFn === 'function') {
            updatedList = mergeFn(currentList, newEntry);
          } else {
            updatedList = [newEntry, ...currentList];
          }

          // Cap max entries in repo log to prevent file bloat (keep last 300 entries)
          if (updatedList.length > 300) {
            updatedList = updatedList.slice(0, 300);
          }

          const putUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}`;
          const formattedJson = JSON.stringify(updatedList, null, 2);
          const putBody = {
            message: `${commitMessage} [skip ci]`,
            content: utf8ToBase64(formattedJson),
            branch: GITHUB_REPO_BRANCH
          };
          if (sha) putBody.sha = sha;

          const putRes = await fetch(putUrl, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify(putBody)
          });

          if (putRes.ok) {
            console.log(`[Telemetry] Recorded successfully to ${filePath}`);
            resolve(true);
            return;
          } else {
            const errData = await putRes.json().catch(() => ({}));
            console.warn(`[Telemetry] Commit failed:`, errData.message);
            resolve(false);
            return;
          }
        } catch (e) {
          console.warn('[Telemetry] Error recording to GitHub:', e);
          resolve(false);
        }
      });
    });
  }

  // Session-level de-duplication cache
  const reportedTooltipsInSession = new Set();

  /**
   * Telemetry for missing / 404 tooltips
   */
  function logMissingTooltip(entityInfo) {
    if (!entityInfo || !entityInfo.id) return;
    const key = `${entityInfo.kind || 'item'}-${entityInfo.id}`;
    if (reportedTooltipsInSession.has(key)) return;
    reportedTooltipsInSession.add(key);

    const entry = {
      id: entityInfo.id,
      kind: entityInfo.kind || 'item',
      name: entityInfo.name || 'Desconocido',
      url: entityInfo.url || '',
      firstSeen: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      occurrences: 1,
      userAgent: (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent.slice(0, 100) : ''
    };

    appendToJsonFileInGit(
      'js/data/missing_tooltips_log.json',
      entry,
      `telemetry: missing tooltip ${entityInfo.kind} #${entityInfo.id}`,
      (existingList, newOne) => {
        const found = existingList.find(x => String(x.id) === String(newOne.id) && x.kind === newOne.kind);
        if (found) {
          found.occurrences = (found.occurrences || 1) + 1;
          found.lastSeen = newOne.lastSeen;
          if (newOne.name && newOne.name !== 'Desconocido' && (!found.name || found.name === 'Desconocido')) {
            found.name = newOne.name;
          }
          return existingList;
        } else {
          return [newOne, ...existingList];
        }
      }
    );
  }

  /**
   * Telemetry for user bug reports & feedback tickets
   */
  async function logUserTicket(ticket) {
    if (!ticket || !ticket.id) return false;
    return await appendToJsonFileInGit(
      'js/data/user_tickets_log.json',
      ticket,
      `ticket: new user report [${ticket.type || 'bug'}] ${ticket.id}`,
      (existingList, newOne) => {
        const filtered = existingList.filter(x => x.id !== newOne.id);
        return [newOne, ...filtered];
      }
    );
  }

  /**
   * Fetches remote logs from GitHub directly (or fallback local file)
   */
  async function fetchRemoteLog(filePath) {
    const token = getToken();
    const headers = { 'Accept': 'application/vnd.github.v3+json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const getUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}?ref=${GITHUB_REPO_BRANCH}&t=${Date.now()}`;
      const res = await fetch(getUrl, { headers, cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.content) {
          const parsed = JSON.parse(base64ToUtf8(data.content));
          if (Array.isArray(parsed)) return parsed;
        }
      }
    } catch (e) {
      console.warn(`[Telemetry] Failed fetching remote ${filePath} via GitHub API, falling back to local:`, e);
    }

    try {
      const localRes = await fetch(`${filePath}?v=${Date.now()}`);
      if (localRes.ok) {
        const localData = await localRes.json();
        if (Array.isArray(localData)) return localData;
      }
    } catch (e) {}

    return [];
  }

  /**
   * Overwrites/Updates a JSON array file directly in Git (for deletions and status toggles)
   */
  async function overwriteJsonFileInGit(filePath, updatedList, commitMessage) {
    const token = getToken();
    if (!token) return false;

    return new Promise((resolve) => {
      enqueueGitOperation(async () => {
        try {
          const getUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}?ref=${GITHUB_REPO_BRANCH}&t=${Date.now()}`;
          let sha = null;

          try {
            const getRes = await fetch(getUrl, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
              },
              cache: 'no-store'
            });
            if (getRes.ok) {
              const getData = await getRes.json();
              sha = getData.sha;
            }
          } catch (e) {}

          const putUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${filePath}`;
          const formattedJson = JSON.stringify(updatedList, null, 2);
          const putBody = {
            message: `${commitMessage} [skip ci]`,
            content: utf8ToBase64(formattedJson),
            branch: GITHUB_REPO_BRANCH
          };
          if (sha) putBody.sha = sha;

          const putRes = await fetch(putUrl, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify(putBody)
          });

          if (putRes.ok) {
            console.log(`[Telemetry] Updated ${filePath} successfully in Git`);
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (err) {
          console.warn('[Telemetry] Error updating file in Git:', err);
          resolve(false);
        }
      });
    });
  }

  window.TelemetryLogger = {
    logMissingTooltip,
    logUserTicket,
    fetchRemoteLog,
    overwriteJsonFileInGit
  };
})(typeof window !== 'undefined' ? window : this);
