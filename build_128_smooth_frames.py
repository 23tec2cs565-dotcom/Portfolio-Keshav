"""
build_128_smooth_frames.py
Generates 128 ultra-smooth, sub-frame blended WebP frames for 360° cursor tracking
and performs deep optical flow and trajectory analysis.
"""

import os
import time
import json
import cv2
import numpy as np
from PIL import Image

def main():
    print("=" * 60)
    print("KESHAV SAIN PORTFOLIO — 128-FRAME NEURAL POSE SYNTHESIS")
    print("=" * 60)
    
    t0 = time.time()
    
    # 1. Load all 192 analysis frames
    print("[1/5] Loading 192 video frames...")
    frames = []
    for i in range(192):
        path = f"public/analysis/frame_{i:03d}.jpg"
        if not os.path.exists(path):
            raise FileNotFoundError(f"Missing {path}")
        f = cv2.imread(path)
        frames.append(f)
    print(f"      Loaded 192 frames ({frames[0].shape[1]}x{frames[0].shape[0]} px).")

    # 2. Watermark Inpainting / Solid Background Reconstruction
    print("[2/5] Cleaning Gemini watermark on all frames (y: 295..360, x: 565..640)...")
    for i in range(192):
        bg_patch = frames[i][300:360, 500:550]
        mean_col = np.median(bg_patch, axis=(0, 1)).astype(np.uint8)
        frames[i][295:360, 565:640] = mean_col
    print("      Watermarks successfully removed across all 192 frames.")

    # 3. Deep Motion & Optical Flow Analysis
    print("[3/5] Performing dense Farneback optical flow & gaze trajectory analysis...")
    optical_flows = []
    for i in range(191):
        g0 = cv2.cvtColor(frames[i][50:185, 260:385], cv2.COLOR_BGR2GRAY)
        g1 = cv2.cvtColor(frames[i+1][50:185, 260:385], cv2.COLOR_BGR2GRAY)
        flow = cv2.calcOpticalFlowFarneback(g0, g1, None, 0.5, 3, 15, 3, 5, 1.2, 0)
        vx = float(np.mean(flow[..., 0]))
        vy = float(np.mean(flow[..., 1]))
        speed = float(np.hypot(vx, vy))
        optical_flows.append({"frame_from": i, "frame_to": i+1, "vx": vx, "vy": vy, "speed": speed})

    # 4. Generate 128 Ultra-Smooth Sub-Frame Interpolated Frames
    print("[4/5] Synthesizing 128 sub-frame interpolated 360° circular trajectory...")
    N_FRAMES = 128
    out_frames = []
    frame_metadata = []

    for i in range(N_FRAMES):
        deg = i * (360.0 / N_FRAMES) # 0.0, 2.8125, 5.625, ...
        
        if 0.0 <= deg < 45.0:
            t = deg / 45.0
            v = 60.0 + t * (76.0 - 60.0)
            sector = "Right to Down-Right"
        elif 45.0 <= deg < 90.0:
            t = (deg - 45.0) / 45.0
            v = 76.0 + t * (84.0 - 76.0)
            sector = "Down-Right to Down"
        elif 90.0 <= deg < 135.0:
            t = (deg - 90.0) / 45.0
            v = 84.0 + t * (108.0 - 84.0)
            sector = "Down to Down-Left"
        elif 135.0 <= deg < 180.0:
            t = (deg - 135.0) / 45.0
            v = 108.0 + t * (128.0 - 108.0)
            sector = "Down-Left to Left"
        elif 180.0 <= deg < 225.0:
            t = (deg - 180.0) / 45.0
            v = 128.0 + t * (148.0 - 128.0)
            sector = "Left to Up-Left"
        elif 225.0 <= deg < 260.0:
            t = (deg - 225.0) / 35.0
            v = 148.0 + t * (158.0 - 148.0)
            sector = "Up-Left to Up"
        elif 260.0 <= deg < 280.0:
            t = (deg - 260.0) / 20.0
            # S-curve cosine blend for organic zero-ghosting bridge
            ct = 0.5 * (1.0 - np.cos(t * np.pi))
            fa = frames[158].astype(np.float32)
            fb = frames[30].astype(np.float32)
            blended = (1.0 - ct) * fa + ct * fb
            frame = np.clip(blended, 0, 255).astype(np.uint8)
            # Clean watermark corner
            bg_patch = frame[300:360, 500:550]
            mean_col = np.median(bg_patch, axis=(0, 1)).astype(np.uint8)
            frame[295:360, 565:640] = mean_col
            out_frames.append(frame)
            frame_metadata.append({
                "index": i,
                "angle_deg": round(deg, 2),
                "angle_rad": round(np.radians(deg), 4),
                "sector": "Up-Apex Loopback (Bridge 158->30)",
                "source_v": round(158.0 + t * (30.0 - 158.0), 2)
            })
            continue
        elif 280.0 <= deg < 315.0:
            t = (deg - 280.0) / 35.0
            v = 30.0 + t * (44.0 - 30.0)
            sector = "Up to Up-Right"
        else: # 315.0 <= deg < 360.0
            t = (deg - 315.0) / 45.0
            v = 44.0 + t * (60.0 - 44.0)
            sector = "Up-Right to Right"

        v_low = int(np.floor(v))
        v_high = min(191, v_low + 1)
        frac = float(v - v_low)
        fa = frames[v_low].astype(np.float32)
        fb = frames[v_high].astype(np.float32)
        blended = (1.0 - frac) * fa + frac * fb
        frame = np.clip(blended, 0, 255).astype(np.uint8)
        
        # Clean watermark corner
        bg_patch = frame[300:360, 500:550]
        mean_col = np.median(bg_patch, axis=(0, 1)).astype(np.uint8)
        frame[295:360, 565:640] = mean_col
        
        out_frames.append(frame)
        frame_metadata.append({
            "index": i,
            "angle_deg": round(deg, 2),
            "angle_rad": round(np.radians(deg), 4),
            "sector": sector,
            "source_v": round(v, 2)
        })

    # Evaluate step differences across all 128 frames
    diffs = [float(np.mean(cv2.absdiff(out_frames[j], out_frames[(j+1)%N_FRAMES]))) for j in range(N_FRAMES)]
    mean_diff = float(np.mean(diffs))
    max_diff = float(np.max(diffs))
    min_diff = float(np.min(diffs))
    print(f"      Step differences in 128-frame cycle:")
    print(f"      Mean diff: {mean_diff:.2f} px, Max diff: {max_diff:.2f} px, Min diff: {min_diff:.2f} px")

    # 5. Export WebP frames
    print("[5/5] Exporting 128 high-definition WebP frames to public/frames/...")
    os.makedirs("public/frames", exist_ok=True)
    
    # Save 128 3-digit frames
    for idx, f in enumerate(out_frames):
        rgb = cv2.cvtColor(f, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(rgb)
        pil_img.save(f"public/frames/frame_{idx:03d}.webp", "WEBP", quality=95, method=6)
        # Also save 2-digit for 0..63 for backward compatibility if ever needed
        if idx < 64:
            pil_img.save(f"public/frames/frame_{idx:02d}.webp", "WEBP", quality=95, method=6)

    # Save center neutral frame
    center_frame = frames[190].copy()
    bg_patch = center_frame[300:360, 500:550]
    mean_col = np.median(bg_patch, axis=(0, 1)).astype(np.uint8)
    center_frame[295:360, 565:640] = mean_col
    rgb_center = cv2.cvtColor(center_frame, cv2.COLOR_BGR2RGB)
    Image.fromarray(rgb_center).save("public/frames/center.webp", "WEBP", quality=96, method=6)
    print("      Exported 128 frames + center.webp successfully.")

    # Save Analysis JSON Telemetry
    analysis_data = {
        "dataset_name": "128_neural_character_poses",
        "total_frames": 128,
        "angular_resolution_deg": 360.0 / 128.0,
        "mean_frame_step_difference": mean_diff,
        "max_frame_step_difference": max_diff,
        "min_frame_step_difference": min_diff,
        "neutral_frame_source": 190,
        "optical_flow_analyzed_steps": len(optical_flows),
        "trajectory_map": frame_metadata
    }

    with open("public/analysis/trajectory_metrics.json", "w", encoding="utf-8") as jf:
        json.dump(analysis_data, jf, indent=2)
    print("      Saved public/analysis/trajectory_metrics.json.")

    # Generate a Visual 128-Frame Compass Diagram
    compass_img = np.full((600, 600, 3), (240, 245, 250), dtype=np.uint8) # warm cream
    cx, cy = 300, 300
    cv2.circle(compass_img, (cx, cy), 220, (210, 180, 150), 2, cv2.LINE_AA)
    cv2.circle(compass_img, (cx, cy), 140, (230, 210, 190), 1, cv2.LINE_AA)
    cv2.circle(compass_img, (cx, cy), 6, (74, 115, 232), -1, cv2.LINE_AA) # coral center

    for i in range(128):
        ang_rad = i * (2.0 * np.pi / 128.0)
        # Point on outer circle
        r1 = 205 if i % 16 == 0 else (212 if i % 4 == 0 else 216)
        r2 = 225
        px1 = int(cx + r1 * np.cos(ang_rad))
        py1 = int(cy + r1 * np.sin(ang_rad))
        px2 = int(cx + r2 * np.cos(ang_rad))
        py2 = int(cy + r2 * np.sin(ang_rad))
        color = (74, 115, 232) if i % 16 == 0 else (140, 109, 140)
        cv2.line(compass_img, (px1, py1), (px2, py2), color, 2 if i % 16 == 0 else 1, cv2.LINE_AA)

    # Cardinal labels
    cv2.putText(compass_img, "0 deg (Right)", (cx + 235, cy + 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (16, 24, 44), 1, cv2.LINE_AA)
    cv2.putText(compass_img, "90 deg (Down)", (cx - 45, cy + 250), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (16, 24, 44), 1, cv2.LINE_AA)
    cv2.putText(compass_img, "180 deg (Left)", (cx - 330, cy + 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (16, 24, 44), 1, cv2.LINE_AA)
    cv2.putText(compass_img, "270 deg (Up)", (cx - 40, cy - 235), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (16, 24, 44), 1, cv2.LINE_AA)
    cv2.putText(compass_img, "128-Frame Circular Telemetry Map", (150, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (74, 115, 232), 2, cv2.LINE_AA)
    cv2.putText(compass_img, f"Resolution: 2.81 deg / frame  |  Max Diff: {max_diff:.2f}px", (160, 68), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (93, 109, 140), 1, cv2.LINE_AA)

    cv2.imwrite("public/analysis/compass_128.jpg", compass_img)
    print("      Saved public/analysis/compass_128.jpg.")
    print("=" * 60)
    print(f"SUCCESS: Synthesized 128 frames in {time.time() - t0:.2f} seconds!")
    print("=" * 60)

if __name__ == "__main__":
    main()
