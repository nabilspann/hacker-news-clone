import { ErrorBoundary, Resource, Show } from "solid-js";
import { formatErrorUrl } from "../utils/utilFunctions";
import { destructure } from "@solid-primitives/destructure";

interface DisplayUserInfoProps {
    key: string;
    value: string;
}
const DisplayUserInfo = (props: DisplayUserInfoProps) => {
    const { key, value } = destructure(props);
    return(
        <div class="flex flex-row p-2">
            <div>{key()}</div>
            <div class="flex w-full justify-end">
                {value()}
            </div>
        </div>
    )
};

export default DisplayUserInfo;
