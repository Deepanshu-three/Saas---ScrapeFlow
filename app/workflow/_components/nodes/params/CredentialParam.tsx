"use client";

import { ParamProps } from "@/types/appNode";
import React, { useId } from "react";
import { 
  SelectContent,
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { GetCredentailsForUser } from "@/actions/credentials/getCredentialsForUser";


function CredentialParam({ param, updateNodeParamValue, value }: ParamProps) {

  const id = useId()

  const query = useQuery({
    queryKey: ["credentials_for_user"],
    queryFn: () => GetCredentailsForUser(),
    refetchInterval: 10000
  })

    return (
      <div className="flex flex-col gap-1 w-full">
        <Label htmlFor={id} className="text-xs flex">
          {param.name}
          {param.required} && <p className="text-red-400 px-2">*</p>
        </Label>
        <Select onValueChange={(value) => updateNodeParamValue(value)} defaultValue={value}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>
                Credentials
                {query?.data?.map((credential) => (
                  <SelectItem key={credential.id} value={credential.id}>{credential.name}</SelectItem>
                ))}
              </SelectLabel>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
}

export default CredentialParam;
