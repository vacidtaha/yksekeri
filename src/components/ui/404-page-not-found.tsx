"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white text-black">
      <section className="min-h-screen flex items-center justify-center">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="w-full sm:w-10/12 md:w-8/12 text-center">
              <div
                className="bg-[url(https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif)] h-[250px] sm:h-[350px] md:h-[400px] bg-center bg-no-repeat bg-contain"
                aria-hidden="true"
              >
                <h1 className="text-center text-black text-6xl sm:text-7xl md:text-8xl pt-6 sm:pt-8 font-light"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                  404
                </h1>
              </div>

              <div className="mt-[-50px]">
                <h3 className="text-2xl text-black sm:text-3xl font-light mb-4"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
                  Aradığın sayfa bulunamadı
                </h3>
                <p className="mb-6 text-gray-600 sm:mb-5 text-lg leading-relaxed max-w-2xl mx-auto"
                   style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                  Umarım sen yanlış linke girmişsindir yoksa bizim site patlamış hoca. 
                  Bi boka yaramayan ana sayfaya git, orada her şey normal (inşallah).
                </p>

                <Button
                  variant="default"
                  onClick={() => router.push("/")}
                  className="my-5 bg-black text-white hover:bg-gray-800 text-lg px-8 py-4 rounded-xl font-medium transition-all duration-200"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                >
                  Ana Sayfaya Dön
                </Button>

                {/* Ders Yönlendirmeleri */}
                <div className="mt-12">
                  <p className="text-gray-600 mb-6"
                     style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>
                    Ya da direkt istediğin derse git:
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/dersler/tyt/matematik")}
                      className="bg-transparent border-gray-300 text-black hover:bg-gray-100 text-sm"
                    >
                      TYT Matematik
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/dersler/tyt/turkce")}
                      className="bg-transparent border-gray-300 text-black hover:bg-gray-100 text-sm"
                    >
                      TYT Türkçe
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/dersler/ayt/matematik")}
                      className="bg-transparent border-gray-300 text-black hover:bg-gray-100 text-sm"
                    >
                      AYT Matematik
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push("/dersler/ayt/fizik")}
                      className="bg-transparent border-gray-300 text-black hover:bg-gray-100 text-sm"
                    >
                      AYT Fizik
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
