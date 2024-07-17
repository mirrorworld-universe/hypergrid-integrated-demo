const { Connection, TransactionInstruction, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } = require('@solana/web3.js');
const bs58 = require('bs58');
const BufferLayout = require('@solana/buffer-layout');
const { Buffer } = require('buffer');

let connection = new Connection("https://grid-1.hypergrid.dev", "confirmed")

// My Wallet: EyYFxQ2FRcSkR8rdvefEDNy69KWHi2xTzbuVKxuBVueS
const feePayer = Keypair.fromSecretKey(
  bs58.decode(
    "5gA6JTpFziXu7py2j63arRUq1H29p6pcPMB74LaNuzcSqULPD6s1SZUS3UMPvFEE9oXmt1kk6ez3C6piTc3bwpJ6"
  )
);

const sonic_program_id = new PublicKey('SonicAccountMigrater11111111111111111111111');
const account_to_migrate = new PublicKey("REPLACE_ACCOUNT")

//build instruction data
/**
 * 
 * @param {*} node_id get "pubkey" from https://api.hypergrid.dev/hypergrid-ssn/hypergridssn/hypergrid_node
 * @param {*} refresh true/false, if true it forces the account to refresh its data from the source node.
 * @returns 
 */
function migrateSourceAccounts(node_id, refresh) {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u32('instruction'),
    new BufferLayout.Blob(32, 'node_id'), 
    BufferLayout.u8('refresh'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode({
    instruction: 2,
    node_id: node_id.toBuffer(),
    refresh: refresh ? 1: 0,
  }, data);

  console.log(data);
  return data;
}

async function migrate_accounts() {
  const transaction = new Transaction()

  let node_id = new PublicKey('39cvwUEpgka9bU7Sn4my82VViMDWaCxi4YoPevfZxLf3'); 

  const instruction = new TransactionInstruction({
    keys: [
      { pubkey: account_to_migrate, isSigner: false, isWritable: false },
    ],
    programId: sonic_program_id,
    data: migrateSourceAccounts(node_id, true), //instruction data
  })

  transaction.add(instruction)

  const transactionSignature =await sendAndConfirmTransaction(
    connection, transaction, [feePayer]);
  console.log('tx signature', transactionSignature);

  let tx = await connection.getTransaction(transactionSignature);
  console.log('Transaction', tx);
}


migrate_accounts().then(() => {
  console.log("Done")
}).catch((err) => {
  console.error(err)
});
