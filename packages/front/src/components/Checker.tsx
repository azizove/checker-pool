import { TonConnectButton } from "@tonconnect/ui-react";
import { useMemo, useRef, useState } from "react";
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
  StyledInput,
} from "./styled/styled";
import DataTable from "react-data-table-component";

export function Checker() {
  const { connected } = useTonConnect();
  const { value, address, add } = useCheckerContract();
  const [fileList, setFileList] = useState<File[]>([]);
  const titleRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const statusRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const fileRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const handleAddProfile = (e: any) => {
    e.preventDefault();
    // add(new Profile(titleRef.current.value, statusRef.current.value));
    console.log(fileRef.current.files);
  };
  const handleFilesUploadChange = () => {
      setFileList(fileRef.current?.files ? Array.from(fileRef.current.files) : []);
    
  }
  /* write a function to transform a filelist to an array */
  // const fileList = useMemo(() => {
  //   return fileRef.current?.files ? Array.from(fileRef.current.files) : [];
  // }, []);
  const columns = useMemo(
    () => [
      {
        name: "ID",
        selector: (row: Profile) => row.id,
      },
      {
        name: "STATUS",
        selector: (row: Profile) => row.status,
      },
      {
        name: "DETAILS",
        selector: (row: Profile) => row.details,
      },
    ],
    []
  );
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
            {/* <DataTable columns={columns} data={value ?? []} /> */}
          </FlexBoxRow>
          <FlexBoxRow>
            <StyledForm onSubmit={handleAddProfile}>
              <StyledLabel>Name</StyledLabel>
              <StyledInput type="text" ref={titleRef} />
              <StyledLabel>Status</StyledLabel>
              <StyledInput type="text" ref={statusRef} />
              <StyledLabel>File</StyledLabel>
              <StyledInput type="file" ref={fileRef} multiple onChange={handleFilesUploadChange}/>
              <ul>
                {fileList.map((file: any, i: number) => (
                  <li key={i}>
                    {file.name} - {file.type}
                  </li>
                ))}
              </ul>
              <Button
                disabled={!connected}
                className={`Button ${connected ? "Active" : "Disabled"}`}
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
