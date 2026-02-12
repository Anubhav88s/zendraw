import RoomCanvas from "@/components/RoomCanvas";

export default async function CanvasPage({
    params,
    searchParams,
} : {
    params: Promise<{slug: string}>;
    searchParams: Promise<{pwd?: string}>;
}){ 
    const {slug} = await params;
    const {pwd} = await searchParams;
    return <div>
        <RoomCanvas slug={slug} initialPassword={pwd} />
    </div>
}   
