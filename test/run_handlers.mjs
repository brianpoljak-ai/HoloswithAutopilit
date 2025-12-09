import { readFileSync } from 'fs';
import path from 'path';

function makeReq(body = {}, method = 'POST') {
  return { method, body, headers: {} };
}

function makeRes() {
  let statusCode = 200;
  let headers = {};
  let body = null;
  return {
    status(code) { statusCode = code; return this; },
    setHeader(k,v){ headers[k]=v },
    json(obj){ body = obj; console.log('JSON Response:', JSON.stringify(obj)); return this; },
    end(){ console.log('end:', statusCode); }
  };
}

async function run() {
  const health = (await import('../api/health.js')).default;
  console.log('Testing /api/health...');
  await health(makeReq({}, 'GET'), makeRes());

  const workspaces = (await import('../api/workspaces.js')).default;
  console.log('Testing /api/workspaces (missing email should 400)...');
  await workspaces(makeReq({}, 'POST'), makeRes());
  console.log('Testing /api/workspaces (with email)...');
  await workspaces(makeReq({ email: 'test@example.com', fullName: 'Test User', company: 'Acme' }, 'POST'), makeRes());
}

run().catch(err => { console.error(err); process.exit(1); });
