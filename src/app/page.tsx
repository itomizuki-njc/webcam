"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

export default function ZooCamera() {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  // 1. シャッターを切る & 合成処理
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    // Canvasを使ってフレームを合成する
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    const frame = new Image();

    img.src = imageSrc;
    frame.src = "/frame.png"; // publicフォルダのフレーム画像

    img.onload = () => {
      // カメラ映像のサイズに合わせる
      canvas.width = img.width;
      canvas.height = img.height;

      if (ctx) {
        // 背景（カメラ映像）を描画
        ctx.drawImage(img, 0, 0);
        // 前景（動物園フレーム）を重ねて描画
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
        
        // 合成した画像をステートに保存
        setImgSrc(canvas.toDataURL("image/png"));
      }
    };
  }, [webcamRef]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
      <h1 className="text-3xl font-bold text-green-800 mb-6">🐾 新入社員サファリカメラ 🐾</h1>

      {!imgSrc ? (
        <div className="relative w-full max-w-2xl border-8 border-yellow-600 rounded-xl overflow-hidden shadow-2xl">
          {/* カメラ映像 */}
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={{ facingMode: "user", aspectRatio: 16/9 }}
            className="w-full h-auto"
          />
          {/* プレビュー用フレーム重ね合わせ（CSS） */}
          <img 
            src="/frame.png" 
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            alt="frame"
          />
          
          <button
            onClick={capture}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full shadow-lg border-4 border-white transition-transform active:scale-90"
          >
            📸 仲間入り（撮影）
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold text-green-700 mb-2">ナイス・ショット！</h2>
          <img src={imgSrc} className="max-w-2xl w-full rounded-xl shadow-xl border-4 border-green-600" />
          
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setImgSrc(null)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg font-bold"
            >
              撮り直す
            </button>
            <a
              href={imgSrc}
              download="new_member.png"
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-green-700"
            >
              画像を保存する
            </a>
          </div>
        </div>
      )}

      <p className="mt-8 text-sm text-green-900 italic">
        ※ 撮影した写真はあなたのデバイスに保存されます。
      </p>
    </div>
  );
}