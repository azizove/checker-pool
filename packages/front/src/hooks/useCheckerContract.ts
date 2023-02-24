import { useState } from "react";
import CheckerProcess from "../contracts/checkerProcess";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { useTonConnect } from "./useTonConnect";
import { Address, OpenedContract } from "ton-core";
import { useQuery } from "@tanstack/react-query";
import { CHAIN } from "@tonconnect/protocol";
import { Profile } from "../models";

export function useCheckerContract() {
  const { client } = useTonClient();
  const { sender, network, wallet } = useTonConnect();

  const checkerContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new CheckerProcess(
      Address.parse("EQAqPKEyyI_XzFaUPXOtLz9WHxHs0HwmrlP-euJXeCYioqDg")
    );
    return client.open(contract) as OpenedContract<CheckerProcess>;
  }, [client]);

  const { data, isFetching } = useQuery(
    ["checker"],
    async () => {
      if (!checkerContract) return null;
      const result = await checkerContract!.getCheckers();
      console.log({result})
      return result;
    },
    { refetchInterval: 3000 }
  );

  return {
    value: isFetching ? null : data,
    address: checkerContract?.address.toString(),
    add: (profile: Profile) => {
       return checkerContract?.sendProfile(sender, wallet, profile);
    },
  };
}
