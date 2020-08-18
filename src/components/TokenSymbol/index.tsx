import React from 'react'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import Img from '../layout/Img'
import { useToken } from 'src/logic/tokens/hooks/useToken'

type Props = {
  tokenAddress: string
}

export const TokenSymbol = ({ tokenAddress }: Props): React.ReactElement => {
  const token = useToken(tokenAddress)
  if (!token) return null
  return <Img alt={token.name} height={26} onError={setImageToPlaceholder} src={token.logoUri} />
}