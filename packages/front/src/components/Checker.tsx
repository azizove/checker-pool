import { TonConnectButton } from "@tonconnect/ui-react";
import { useRef } from "react";
import { useCheckerContract } from "../hooks/useCheckerContract";
import { useTonConnect } from "../hooks/useTonConnect";
import { Profile } from "../models";

import {
  Card,
  FlexBoxCol,
  FlexBoxRow,
  Ellipsis,
  Button,
  StyledForm,
  StyledLabel,
  StyledInput
} from "./styled/styled";

export function Checker() {
  const { connected } = useTonConnect();
  const { value, address, add } = useCheckerContract();
  const titleRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const statusRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  return (
    <div className="Container">

      <Card>
        <FlexBoxCol>
          <h3>Checker</h3>
          <FlexBoxRow>
            <b>Address</b>
            <Ellipsis>{address}</Ellipsis>
          </FlexBoxRow>
          <FlexBoxRow>
            <b>Value</b>
            <div>{value ?? "Loading..."}</div>
          </FlexBoxRow>
          <FlexBoxRow>
            <StyledForm>
              <StyledLabel>Name</StyledLabel>
              <StyledInput type="text" ref={titleRef}/>
              <StyledLabel>Status</StyledLabel>
              <StyledInput type="text" ref={statusRef}/>
              <Button
                disabled={!connected}
                className={`Button ${connected ? "Active" : "Disabled"}`}
                onClick={() => {
                  add(new Profile(titleRef.current.value, statusRef.current.value));
                }}
              >
                Add Profile
              </Button>
          </StyledForm>
          </FlexBoxRow>
          
        </FlexBoxCol>
      </Card>
    </div>
  );
}
