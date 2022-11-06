import React from "react"
import { styled } from "@mui/material/styles"

type StatTextProps = {
  children: React.ReactNode,
}

export default function StatText({ children }: StatTextProps) {
  const Wrapper = styled('div')(({ theme }) => ({
    ...theme.typography.body1,
    fontSize: "2.5rem",
    textAlign: "center",
    padding: "0 0.5rem",
    maxWidth: "3rem",
  }));
  
  return (
    <Wrapper>
      {children?.toString()}
    </Wrapper>
  )
}