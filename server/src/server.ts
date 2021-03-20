import express from 'express';
import http from 'http';

export default class Server {
  public app = express();

  public http: http.Server = http.createServer(this.app);

  public port = 3000;

  public start() {
  
    this.app.get('/', (req, res) => {
      res.send('hello world');
    });

    this.http.listen(this.port);
    console.log(`server is listening on ${this.port}`);
  }
}
