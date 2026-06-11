import { RlpDataLike } from "@/libs/rlp/data/mod.ts";
import { RlpUintLike } from "@/libs/rlp/uint/mod.ts";
import { Readable, Writable } from "@hazae41/binary";
import { EIP2718TypedTransactionEnvelope } from "@hazae41/eip2718";
import { EIP2930AccessItem } from "@hazae41/eip2930";
import { RlpItem, RlpList } from "@hazae41/rlp";

export interface EIP1559UnsignedTransactionInit {
  readonly chainId: RlpUintLike

  readonly nonce: RlpUintLike

  readonly maxFeePerGas: RlpUintLike
  readonly maxPriorityFeePerGas: RlpUintLike
  readonly gasLimit: RlpUintLike

  readonly destination?: RlpDataLike
  readonly amount: RlpUintLike
  readonly data?: RlpDataLike

  readonly accessList?: EIP2930AccessItem[]
}

export class EIP1559UnsignedTransaction {

  constructor(
    readonly chainId: RlpUintLike,
    readonly nonce: RlpUintLike,
    readonly maxPriorityFeePerGas: RlpUintLike,
    readonly maxFeePerGas: RlpUintLike,
    readonly gasLimit: RlpUintLike,
    readonly destination: RlpDataLike = new Uint8Array(),
    readonly amount: RlpUintLike,
    readonly data: RlpDataLike = new Uint8Array(),
    readonly accessList: EIP2930AccessItem[] = [],
  ) { }

  static from(init: EIP1559UnsignedTransactionInit): EIP1559UnsignedTransaction {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, destination, amount, data, accessList } = init
    return new EIP1559UnsignedTransaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, destination, amount, data, accessList)
  }

  static decode(bytes: Uint8Array): EIP1559UnsignedTransaction {
    const envelope = Readable.readFromBytes(EIP2718TypedTransactionEnvelope, bytes)

    if (envelope.type !== 0x02)
      throw new Error()

    const list = RlpList.as(envelope.data)

    const chainId = RlpUintLike.from(RlpItem.as(list.value[0]))

    const nonce = RlpUintLike.from(RlpItem.as(list.value[1]))

    const maxPriorityFeePerGas = RlpUintLike.from(RlpItem.as(list.value[2]))
    const maxFeePerGas = RlpUintLike.from(RlpItem.as(list.value[3]))
    const gasLimit = RlpUintLike.from(RlpItem.as(list.value[4]))

    const destination = RlpDataLike.from(RlpItem.as(list.value[5]))
    const amount = RlpUintLike.from(RlpItem.as(list.value[6]))
    const data = RlpDataLike.from(RlpItem.as(list.value[7]))

    const accessList = RlpList.as(list.value[8]).value.map(EIP2930AccessItem.from)

    return new EIP1559UnsignedTransaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, destination, amount, data, accessList)
  }

  encode(): Uint8Array {
    const chainId = RlpUintLike.into(this.chainId)

    const nonce = RlpUintLike.into(this.nonce)

    const maxPriorityFeePerGas = RlpUintLike.into(this.maxPriorityFeePerGas)
    const maxFeePerGas = RlpUintLike.into(this.maxFeePerGas)
    const gasLimit = RlpUintLike.into(this.gasLimit)

    const destination = RlpDataLike.into(this.destination)
    const amount = RlpUintLike.into(this.amount)
    const data = RlpDataLike.into(this.data)

    const accessList = RlpList.from(this.accessList.map(EIP2930AccessItem.into))

    const list = RlpList.from([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, destination, amount, data, accessList])

    return Writable.writeToBytes(new EIP2718TypedTransactionEnvelope(0x02, list))
  }

  sign(signature: Uint8Array): EIP1559SignedTransaction {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, destination, amount, data, accessList } = this

    const r = signature.slice(0, 32)
    const s = signature.slice(32, 64)

    const yParity = signature[64]

    return new EIP1559SignedTransaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, destination, amount, data, accessList, yParity, r, s)
  }

}

export interface EIP1559SignedTransactionInit {
  readonly chainId: RlpUintLike

  readonly nonce: RlpUintLike

  readonly maxFeePerGas: RlpUintLike
  readonly maxPriorityFeePerGas: RlpUintLike
  readonly gasLimit: RlpUintLike

  readonly destination?: RlpDataLike
  readonly amount: RlpUintLike
  readonly data?: RlpDataLike

  readonly accessList?: EIP2930AccessItem[]

  readonly yParity: RlpUintLike

  readonly r: RlpDataLike
  readonly s: RlpDataLike
}

export class EIP1559SignedTransaction {

  constructor(
    readonly chainId: RlpUintLike,
    readonly nonce: RlpUintLike,
    readonly maxPriorityFeePerGas: RlpUintLike,
    readonly maxFeePerGas: RlpUintLike,
    readonly gasLimit: RlpUintLike,
    readonly destination: RlpDataLike = new Uint8Array(),
    readonly amount: RlpUintLike,
    readonly data: RlpDataLike = new Uint8Array(),
    readonly accessList: EIP2930AccessItem[] = [],
    readonly yParity: RlpUintLike,
    readonly r: RlpDataLike,
    readonly s: RlpDataLike,
  ) { }

  static from(init: EIP1559SignedTransaction): EIP1559SignedTransaction {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, destination, amount, data, accessList, yParity, r, s } = init
    return new EIP1559SignedTransaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, destination, amount, data, accessList, yParity, r, s)
  }

  static decode(bytes: Uint8Array): EIP1559SignedTransaction {
    const envelope = Readable.readFromBytes(EIP2718TypedTransactionEnvelope, bytes)

    if (envelope.type !== 0x02)
      throw new Error()

    const list = RlpList.as(envelope.data)

    const chainId = RlpUintLike.from(RlpItem.as(list.value[0]))
    const nonce = RlpUintLike.from(RlpItem.as(list.value[1]))

    const maxPriorityFeePerGas = RlpUintLike.from(RlpItem.as(list.value[2]))
    const maxFeePerGas = RlpUintLike.from(RlpItem.as(list.value[3]))
    const gasLimit = RlpUintLike.from(RlpItem.as(list.value[4]))

    const destination = RlpDataLike.from(RlpItem.as(list.value[5]))
    const amount = RlpUintLike.from(RlpItem.as(list.value[6]))
    const data = RlpDataLike.from(RlpItem.as(list.value[7]))

    const accessList = RlpList.as(list.value[8]).value.map(EIP2930AccessItem.from)

    const yParity = RlpUintLike.from(RlpItem.as(list.value[9]))

    const r = RlpDataLike.from(RlpItem.as(list.value[10]))
    const s = RlpDataLike.from(RlpItem.as(list.value[11]))

    return new EIP1559SignedTransaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, destination, amount, data, accessList, yParity, r, s)
  }

  encode(): Uint8Array {
    const chainId = RlpUintLike.into(this.chainId)
    const nonce = RlpUintLike.into(this.nonce)

    const maxPriorityFeePerGas = RlpUintLike.into(this.maxPriorityFeePerGas)
    const maxFeePerGas = RlpUintLike.into(this.maxFeePerGas)
    const gasLimit = RlpUintLike.into(this.gasLimit)

    const destination = RlpDataLike.into(this.destination)
    const amount = RlpUintLike.into(this.amount)
    const data = RlpDataLike.into(this.data)

    const accessList = RlpList.from(this.accessList.map(EIP2930AccessItem.into))

    const yParity = RlpUintLike.into(this.yParity)

    const r = RlpDataLike.into(this.r)
    const s = RlpDataLike.into(this.s)

    const list = RlpList.from([chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, destination, amount, data, accessList, yParity, r, s])

    return Writable.writeToBytes(new EIP2718TypedTransactionEnvelope(0x02, list))
  }

  unsign(): EIP1559UnsignedTransaction {
    const { chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, destination, amount, data, accessList } = this
    return new EIP1559UnsignedTransaction(chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gasLimit, destination, amount, data, accessList)
  }

}