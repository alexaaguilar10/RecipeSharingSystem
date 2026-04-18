const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || "http://user-service:3001";
const RECIPE_SERVICE_URL =
  process.env.RECIPE_SERVICE_URL || "http://recipe-service:3002";
const FAVORITES_SERVICE_URL =
  process.env.FAVORITES_SERVICE_URL || "http://favorites-service:3003";
const publicFolder = path.join(__dirname, "public");

app.use(express.json());
app.use(express.static(publicFolder));

function getRequestBody(req) {
  if (req.method === "GET" || req.method === "HEAD") {
    return undefined;
  }

  return JSON.stringify(req.body || {});
}

async function sendRequestToService(req, res, serviceUrl, routePrefix) {
  const pathAfterPrefix = req.originalUrl.replace(routePrefix, "") || "/";
  const fullServiceUrl = `${serviceUrl}${pathAfterPrefix}`;
  const requestHeaders = {
    Accept: "application/json"
  };

  if (req.headers["content-type"]) {
    requestHeaders["Content-Type"] = req.headers["content-type"];
  }

  const requestOptions = {
    method: req.method,
    headers: requestHeaders,
    body: getRequestBody(req)
  };

  try {
    const serviceResponse = await fetch(fullServiceUrl, requestOptions);
    const responseText = await serviceResponse.text();
    const contentType =
      serviceResponse.headers.get("content-type") || "application/json";

    res.status(serviceResponse.status);
    res.set("Content-Type", contentType);
    res.send(responseText);
  } catch (error) {
    res.status(502).json({
      message: "Service unavailable",
      service: serviceUrl,
      details: error.message
    });
  }
}

app.use("/api/users", (req, res) => {
  sendRequestToService(req, res, USER_SERVICE_URL, "/api/users");
});

app.use("/api/recipes", (req, res) => {
  sendRequestToService(req, res, RECIPE_SERVICE_URL, "/api/recipes");
});

app.use("/api/favorites", (req, res) => {
  sendRequestToService(req, res, FAVORITES_SERVICE_URL, "/api/favorites");
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    gateway: "api-gateway",
    services: {
      users: USER_SERVICE_URL,
      recipes: RECIPE_SERVICE_URL,
      favorites: FAVORITES_SERVICE_URL
    }
  });
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(publicFolder, "homepage.html"));
});

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
});