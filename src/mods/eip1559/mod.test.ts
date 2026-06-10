import { test } from "@hazae41/phobos";
import { EIP1559SignedTransaction, EIP1559UnsignedTransaction } from "./mod.ts";

test("eip1559", () => {
  const utx = EIP1559UnsignedTransaction.from({ chainId: 1n, nonce: 0n, maxFeePerGas: 100n, maxPriorityFeePerGas: 1000n, gasLimit: 1000n, destination: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", amount: 100n, data: new Uint8Array([1, 2, 3]) })
  const stx = utx.sign(crypto.getRandomValues(new Uint8Array(65)))

  console.log(stx)

  const raw = stx.encode()
  console.log(raw.toHex())

  const stx2 = EIP1559SignedTransaction.decode(raw)
  const utx2 = stx2.unsign()

  console.log(utx2)
})