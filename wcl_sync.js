// Test player combatant info and secondary stats from report
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

async function testPlayerStats() {
  const token = await getAuthToken();
  const q = `
    query {
      reportData {
        report(code: "FLvCGMTNVxAmKyRB") {
          events(fightIDs: [2], dataType: CombatantInfo, limit: 10) {
            data
          }
        }
      }
    }
  `;
  const res = await queryGraphQL(token, q);
  const events = res.data?.reportData?.report?.events?.data || [];
  console.log('Found combatant events:', events.length);
  if (events.length > 0) {
    const sample = events[0];
    console.log('Sample Combatant Info Keys:', Object.keys(sample));
    console.log('Stats:', sample.stats);
    console.log('Secondary attributes:', {
      mastery: sample.mastery,
      crit: sample.critSpell || sample.critMelee || sample.critRanged,
      haste: sample.hasteSpell || sample.hasteMelee,
      vers: sample.versatilityDamageDone
    });
  }
}

testPlayerStats();
