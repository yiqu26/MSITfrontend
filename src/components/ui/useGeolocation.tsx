import { useEffect, useState } from "react"

interface GeolocationCoords {
    latitude: number
    longitude: number
    accuracy?: number
}

export function useGeolocation() {
    const [location, setLocation] = useState<GeolocationCoords | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        console.log("🚀 useGeolocation triggered")

        if (!navigator.geolocation) {
            setError("這個瀏覽器不支援定位功能")
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                })
            },
            (err) => {
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("使用者拒絕提供位置")
                        break
                    case err.POSITION_UNAVAILABLE:
                        setError("無法取得位置資訊")
                        break
                    case err.TIMEOUT:
                        setError("取得位置逾時")
                        break
                    default:
                        setError("發生未知錯誤")
                }
            }
        )
    }, [])

    return { location, error }
}
