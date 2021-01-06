import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

//import { GasEstimationInfo } from 'src/logic/safe/transactions/gas'

import { getUserNonce } from 'src/logic/wallets/ethTransactions'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { getLastTx, getNewTxNonce } from 'src/logic/safe/store/actions/utils'
import { getGnosisSafeInstanceAt } from 'src/logic/contracts/safeContracts'
import { safeSelector } from 'src/logic/safe/store/selectors'

export type TxParameters = {
  safeNonce: number | undefined
  setSafeNonce: (safeNonce: number) => void
  safeTxGas: number
  setSafeTxGas: (gas: number) => void
  ethNonce: number | undefined
  setEthNonce: (ethNonce: number | undefined) => void
  ethGasLimit: number | undefined
  setEthGasLimit: (ethGasLimit: number | undefined) => void
  ethGasPrice: number | undefined
  setEthGasPrice: (ethGasPrice: number | undefined) => void
}

/**
 * This hooks is used to store tx parameter
 * It needs to be initialized calling setGasEstimation.
 */
export const useTransactionParameters = (): TxParameters => {
  //const [gasEstimation, setGasEstimation] = useState<GasEstimationInfo | undefined>()
  const connectedWalletAddress = useSelector(userAccountSelector)
  const { address: safeAddress } = useSelector(safeSelector) || {}

  /* Safe Params */
  const [safeNonce, setSafeNonce] = useState<number | undefined>(undefined)
  const [safeTxGas, setSafeTxGas] = useState(0) // for a new Tx call requiredTxGas, for an existing tx get it from the backend.
  /* ETH Params */
  const [ethNonce, setEthNonce] = useState<number | undefined>(undefined) // we delegate it to the wallet
  const [ethGasLimit, setEthGasLimit] = useState<number | undefined>(20) // call execTx until it returns a number > 0
  const [ethGasPrice, setEthGasPrice] = useState<number | undefined>(undefined) // get fast gas price

  /* get nonce for connected wallet */
  useEffect(() => {
    const getNonce = async () => {
      const res = await getUserNonce(connectedWalletAddress)
      setEthNonce(res)
    }

    if (connectedWalletAddress) {
      getNonce()
    }
  }, [connectedWalletAddress])

  /* calc safe nonce */
  useEffect(() => {
    const getSafeNonce = async () => {
      const safeInstance = await getGnosisSafeInstanceAt(safeAddress as string)
      const lastTx = await getLastTx(safeAddress as string)
      const nonce = await getNewTxNonce(undefined, lastTx, safeInstance)
      setSafeNonce(Number(nonce))
    }

    if (safeAddress) {
      getSafeNonce()
    }
  }, [safeAddress])

  return {
    safeNonce,
    setSafeNonce,
    safeTxGas,
    setSafeTxGas,
    ethNonce,
    setEthNonce,
    ethGasLimit,
    setEthGasLimit,
    ethGasPrice,
    setEthGasPrice,
  }
}