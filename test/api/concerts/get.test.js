const Concert = require('../../../models/concert.model');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('GET /api/concerts', () => {
  before(async () => {
    const testConcertOne = new Concert(
      { _id: '5d9f1140f10a81216cfd4408', performer:'John Doe', genre:'Rock',
        price: 25, day: 1, image: '/img/uploads/1fsd324fsdg.jpg' });
    await testConcertOne.save();

    const testConcertTwo = new Concert(
      { _id: '5d9f1159f81ce8d1ef2bee48', performer:'Rebekah Parker', genre:'R&B',
        price: 35, day: 1, image: '/img/uploads/1fsd324fsdg.jpg' });

    await testConcertTwo.save();  
  });     
  it('/ should return concerts by performer', async () => {
    const res = await request(server).get('/api/concerts/performer/John Doe');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(1);
  });
  it('/ should return concerts by genre', async () => {
    const res = await request(server).get('/api/concerts/genre/R&B');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(1);
  });
  it('/ should return concerts by day', async () => {
    const res = await request(server).get(`/api/concerts/day/1`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);
  });
  it('/ should return concerts by prices', async () => {
    const res = await request(server).get(`/api/concerts/price/15/30`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(1);
  });
  
  after(async () => {
    await Concert.deleteMany();
  });

});

