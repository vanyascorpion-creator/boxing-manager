// Временный скрипт для ручной проверки auth-потока. Запуск: node scripts/check-auth.mjs
const BASE = process.env.BASE ?? "http://localhost:3000";

const login = `coach${Math.floor(Math.random() * 100000)}`;
const password = "Secret-123";

let cookie = "";

function takeCookies(res) {
  const raw = res.headers.getSetCookie?.() ?? [];
  for (const c of raw) {
    const pair = c.split(";")[0];
    const [name, value] = pair.split("=");
    if (cookie.includes(`${name}=`)) {
      cookie = cookie.replace(new RegExp(`${name}=[^;]*`), pair);
    } else {
      cookie += (cookie ? "; " : "") + pair;
    }
  }
}

async function call(method, path, body, useCookie = true) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(useCookie && cookie ? { cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
  takeCookies(res);
  const text = await res.text();
  let data = text;
  try {
    data = JSON.parse(text);
  } catch {}
  return { status: res.status, data, location: res.headers.get("location") };
}

const results = [];
function check(label, actual, expected) {
  const ok = actual === expected;
  results.push({ label, actual, expected, ok });
  console.log(`${ok ? "OK  " : "FAIL"}  ${label}: ${actual}${ok ? "" : ` (ожидалось ${expected})`}`);
}

console.log(`\nПользователь для теста: ${login}\n`);

const reg = await call("POST", "/api/auth/register", { login, password });
check("регистрация -> 201", reg.status, 201);
console.log("      ответ:", JSON.stringify(reg.data));

const me = await call("GET", "/api/auth/me");
check("me с cookie -> 200", me.status, 200);
console.log("      ответ:", JSON.stringify(me.data));

const home = await call("GET", "/");
check("GET / с cookie -> 200", home.status, 200);

const anon = await call("GET", "/", null, false);
check("GET / без cookie -> 307", anon.status, 307);
check("редирект ведёт на /login", anon.location, "/login");

const dup = await call("POST", "/api/auth/register", { login, password }, false);
check("повторная регистрация -> 409", dup.status, 409);

const badLogin = await call(
  "POST",
  "/api/auth/login",
  { login, password: "wrong-password" },
  false
);
check("вход с неверным паролем -> 401", badLogin.status, 401);

const shortPass = await call(
  "POST",
  "/api/auth/register",
  { login: "someoneelse", password: "123" },
  false
);
check("короткий пароль -> 400", shortPass.status, 400);

const relogin = await call("POST", "/api/auth/login", { login, password }, false);
check("вход с верным паролем -> 200", relogin.status, 200);

const logout = await call("POST", "/api/auth/logout");
check("logout -> 200", logout.status, 200);

const meAfter = await call("GET", "/api/auth/me");
check("me после logout -> 401", meAfter.status, 401);

const homeAfter = await call("GET", "/");
check("GET / после logout -> 307", homeAfter.status, 307);

const fightersAnon = await call("GET", "/api/fighters");
check("список бойцов без cookie -> 401", fightersAnon.status, 401);

const relogin2 = await call("POST", "/api/auth/login", {
  login,
  password,
});

const fightersAuthed = await call("GET", "/api/fighters");
check("список бойцов с cookie -> 200", fightersAuthed.status, 200);

const failed = results.filter((r) => !r.ok);
console.log(
  `\nИтог: ${results.length - failed.length}/${results.length} проверок пройдено`
);
if (failed.length) {
  console.log("Провалено:", failed.map((f) => f.label).join(", "));
  process.exit(1);
}
