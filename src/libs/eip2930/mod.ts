// deno-lint-ignore-file no-namespace

import { RlpDataLike } from "@/libs/rlp/data/mod.ts";
import { Rlp, RlpItem, RlpList } from "@hazae41/rlp";

export interface EIP2930AccessItem {
  readonly address: RlpDataLike
  readonly storage: RlpDataLike[]
}

export namespace EIP2930AccessItem {

  export function from(rlp: Rlp): EIP2930AccessItem {
    const list = RlpList.as(rlp)

    const address = RlpDataLike.from(RlpItem.as(list.value[0]))
    const storage = RlpList.as(list.value[1]).value.map(item => RlpDataLike.from(RlpItem.as(item)))

    return { address, storage }
  }

  export function into(self: EIP2930AccessItem): Rlp {
    const address = RlpDataLike.into(self.address)
    const storage = RlpList.from(self.storage.map(RlpDataLike.into))

    return RlpList.from([address, storage])
  }

}