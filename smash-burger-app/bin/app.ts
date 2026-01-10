#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { RandyBurgerStack } from '../src/library/randy-burger-stack.js'; // Note the .js extension for ESM imports!

const app = new cdk.App();
new RandyBurgerStack(app, 'RandyBurgerStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION 
  },
});