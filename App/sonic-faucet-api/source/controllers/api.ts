import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();

import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import axios from "axios";

// import cmd from 'node-cmd';
const cmd = require('node-cmd');

const SOLANA_CLI_PATH = "/home/ubuntu/.local/share/solana/install/releases/1.18.12/solana-release/bin/solana";

const airdrop = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (Number(req.params.amount) > 10) return res.status(401).json({ error: 'Airdrop amount must <= 10' });

    const recipient = cmd.runSync([
      SOLANA_CLI_PATH,
      "transfer",
      req.params.user,
      req.params.amount,
      "--allow-unfunded-recipient",
      "--url localhost"
    ].join(" "));

    return res.status(200).json({ status: "ok", data: recipient });
  } catch (error: any) {
    return res.status(401).json({ error: error.toString() });
  }
};

export default { airdrop };
