"use client";

import { AddPet } from "@/components/addPet/addPet"
import { useRouter } from "next/navigation";

const AddPetPage = () => {

    const router = useRouter();
    return (
        <div>
            <AddPet onBack={() => router.back()} onSuccess={() => router.back()} />
        </div>
    )
}

export default AddPetPage;