import { useState, useRef } from 'react'
import { SubmitButton } from '@/components/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Video } from "lucide-react"

export default function Component() {
    const [videoSrc, setVideoSrc] = useState<string | null>(null)
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
    const videoRef = useRef<HTMLVideoElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type.startsWith('video/')) {
            setSelectedVideo(file)
            const videoUrl = URL.createObjectURL(file)
            setVideoSrc(videoUrl)
        } else {
            alert('Please select a valid video file.')
        }
    }

    const handleSubmit = async () => {
        console.log(selectedVideo);
        if(!selectedVideo) return;
        const formData = new FormData();
        formData.append('video', selectedVideo);

        try {
            
            const res = await fetch("http://localhost:8000/api/upload-video", {
                method: "POST",
                body: formData,
            })

            const {data} = await res.json();
            alert(data);

        } catch (error) {
            console.log(error);            
            alert('something went wrong');
        }

    }

    return (
        <div className='flex justify-center items-center w-full h-full bg-slate-500'>
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Video Upload</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="video-upload">Upload Video</Label>
                        <Input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="cursor-pointer"
                        />
                    </div>
                    {videoSrc && (
                        <div className="space-y-2 h-48">
                            <Label>Video Preview</Label>
                            <video
                                ref={videoRef}
                                src={videoSrc}
                                className="w-full rounded-lg h-48"
                                controls
                            />
                        </div>
                    )}
                    {!videoSrc && (
                        <div className="flex flex-col items-center justify-center h-48 bg-gray-100 rounded-lg">
                            <Video className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">No video selected</p>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <div className="flex items-center justify-center w-full mt-5 mb-0">
                        <SubmitButton handleSubmit={handleSubmit} />
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}