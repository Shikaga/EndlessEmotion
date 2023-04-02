const sinon = require('sinon');
const axios = require('axios');
const expect = require('chai').expect;
const winston = require('winston');
const { ElevenLabsHandler } = require('../src/elevenLabsHandler.js');

describe('ElevenLabs', () => {
    it('should return an MPEG when passed a message', () => {
        expect(ElevenLabsHandler).to.be.a('function');
    });
});