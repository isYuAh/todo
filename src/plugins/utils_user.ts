import { loginVaildParams } from "@/types";
import { useRouter } from "vue-router";

export function vaildLogin(loginVaildParmas: loginVaildParams){
    if (Object.values(loginVaildParmas).some((p) => {
        return !p
    })) {
        let router = useRouter();
        router.push({
            name: 'account-login'
        })
    }
}