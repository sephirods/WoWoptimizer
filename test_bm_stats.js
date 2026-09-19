// Fetch real top players for Beast Mastery Hunter and calculate average stats
const fs = require('fs');

const CLIENT_ID = '01a0b620-a2e6-72dc-a93d-68386d281d09';
const CLIENT_SECRET = 'QlS4m7axvYtgRENhw6AlsVIpBEc5CEeopEn4fgpm';

async function getAuthToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch('https://www.warcraftlogs.com/oauth/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const data = await res.json();
  return data.access_token;
}

async function queryGraphQL(token, query) {
  const res = await fetch('https://www.warcraftlogs.com/api/v2/client', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  return await res.json();
}

async function getSpecAverage(className, specName, encounterId = 2902) {
  const token = await getAuthToken();
  const q = `
    query {
      worldData {
        encounter(id: ${encounterId}) {
          characterRankings(className: "${className}", specName: "${specName}", metric: dps, difficulty: 5)
        }
      }
    }
  `;
  const res = await queryGraphQL(token, q);
  const rankings = res.data?.worldData?.encounter?.characterRankings?.rankings || [];
  console.log(`Found ${rankings.length} rankings for ${className} - ${specName}`);
  
  const topReports = rankings.slice(0, 5);
  const statsList = [];

  for (const r of topReports) {
    if (!r.report?.code || !r.report?.fightID) continue;
    const reportQuery = `
      query {
        reportData {
          report(code: "${r.report.code}") {
            events(fightIDs: [${r.report.fightID}], dataType: CombatantInfo, limit: 30) {
              data
            }
          }
        }
      }
    `;
    const reportRes = await queryGraphQL(token, reportQuery);
    const events = reportRes.data?.reportData?.report?.events?.data || [];
    
    // Find player event
    for (const ev of events) {
      if (ev.mastery && (ev.critMelee || ev.critRanged || ev.critSpell)) {
        statsList.push({
          mastery: ev.mastery,
          crit: ev.critRanged || ev.critMelee || ev.critSpell,
          haste: ev.hasteRanged || ev.hasteMelee || ev.hasteSpell,
          vers: ev.versatilityDamageDone
        });
        break;
      }
    }
  }

  console.log(`Collected stats for ${statsList.length} top logs:`, statsList);
}

getSpecAverage("Hunter", "BeastMastery");
