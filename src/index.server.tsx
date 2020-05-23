// tslint:disable:no-any
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

import * as fastify from 'fastify';
import * as logger from 'morgan';
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import rotatingFileStream from 'rotating-file-stream';
import * as useragent from 'useragent';

import { serveStaticCompression } from 'serve-static-compression/serveStaticCompression';

interface IHash {
  filePath: string;
  value: string;
}

interface IStaticFilePathWithHashOptions {
  rootUrl: string;
  rootFilePath: string;
  revisionKey: string;
}

const app: any = fastify();

const APP_SERVER_PORT: number = Number(process.env.PORT || '3000');

function minifyHTML(htmlString: string): string {
  const parts: string[] = htmlString.split('\n');
  const minifiedParts: string[] = parts.map((part: string) => part.trim());

  return minifiedParts.join('');
}

function createHash(filePath: string): IHash {
  const content: string = fs.readFileSync(filePath, 'utf-8');
  const hash: string = crypto
    .createHash('sha1')
    .update(content)
    .digest('hex');

  return {
    filePath,
    value: hash,
  };
}

function staticFilePathWithHash(filePath: string, options: IStaticFilePathWithHashOptions): string {
  const hash: IHash = createHash(path.join(options.rootFilePath, filePath));
  const staticFileUrl: string = hash.filePath.replace(options.rootFilePath, options.rootUrl).replace('//', '/');

  return `${staticFileUrl}?${options.revisionKey}=${hash.value}`;
}

function template(mobile: boolean): string {
  const applicationName: string = 'note';
  const staticFilePathWithHashOptions: IStaticFilePathWithHashOptions = {
    revisionKey: 'revision',
    rootFilePath: path.join(__dirname, 'public'),
    rootUrl: '/',
  };
  const htmlString: string = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover">

  <meta name="theme-color" content="#fbfaf5"/>

  <link rel="manifest" href="/manifest.json">
  <script defer src="${staticFilePathWithHash('/bundle.vendors.js', staticFilePathWithHashOptions)}"></script>
  <script defer src="${staticFilePathWithHash('/bundle.commons.js', staticFilePathWithHashOptions)}"></script>
  <script defer src="${
    mobile
      ? staticFilePathWithHash('/bundle.mobile.js', staticFilePathWithHashOptions)
      : staticFilePathWithHash('/bundle.desktop.js', staticFilePathWithHashOptions)
  }"></script>
  <link rel="stylesheet" href="${staticFilePathWithHash('/index.css', staticFilePathWithHashOptions)}">
  <meta name="mobile-web-app-capable" content="yes">

  <meta name="apple-mobile-web-app-title" content="${applicationName}">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <link rel="apple-touch-icon" sizes="180x180" href="/images/logo/icon_ios.png">
  <link rel="apple-touch-startup-image" href="/images/logo/icon_ios.png">

  <link rel="icon" sizes="192x192" type="image/png" href="/images/logo/favicon.png">

  <title>${applicationName}</title>

  <script>
  window.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js');
    }
  });
  </script>
</head>
<body>
  <section class="Application">
    <main class="Application--Main"></main>
  </section>
</body>
</html>
`;

  return minifyHTML(htmlString);
}

function isMobile(ua: string): boolean {
  const agent: any = useragent.parse(ua);
  const os: string = agent.os.toString();
  switch (true) {
    case os.indexOf('Android') !== -1: {
      return true;
    }
    case os.indexOf('iOS') !== -1: {
      return true;
    }
    case os.indexOf('Windows Phone') !== -1: {
      return true;
    }
    default: {
      return false;
    }
  }
}

const desktopHTML: string = template(false);
const mobileHTML: string = template(true);
const logDirectory: string = path.join(__dirname, '..', './log');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}
const accessLogStream: any = rotatingFileStream('access.log', {
  interval: '1d',
  path: logDirectory,
});
if (process.env.NODE_ENV !== 'production') {
  app.use(logger('combined'));
}
app.use('/', serveStaticCompression(path.join(__dirname, 'public')));
app.use('/', serveStaticCompression(path.join(__dirname, 'assets')));
app.use(logger('combined', { stream: accessLogStream }));
app.get(
  '*',
  (req: any, res: any): void => {
    if (isMobile(req.headers['user-agent'])) {
      res.type('text/html').send(mobileHTML);

      return;
    }
    res.type('text/html').send(desktopHTML);
  },
);

app.listen(APP_SERVER_PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`Start app at ${new Date().toString()}.`);
});
