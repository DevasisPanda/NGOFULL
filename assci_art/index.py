import cv2
import os
import time
import numpy as np
from moviepy.editor import VideoFileClip
import pygame

def convert_frame_to_ascii(frame, width=80):
    """
    Convert a frame to ASCII art using a character set based on brightness.
    """
    ascii_chars = " .:-=+*#%@"
    height = int(frame.shape[0] * width / frame.shape[1] / 2)
    if height <= 0: height = 1
    if width <= 0: width = 1
    
    resized_frame = cv2.resize(frame, (width, height))
    gray_frame = cv2.cvtColor(resized_frame, cv2.COLOR_BGR2GRAY)
    normalized = gray_frame / 255.0
    
    ascii_frame = ""
    for row in normalized:
        for pixel in row:
            index = int(pixel * (len(ascii_chars) - 1))
            ascii_frame += ascii_chars[index]
        ascii_frame += "\n"
    
    return ascii_frame

def play_video_in_terminal(video_path, width=80):
    """
    Plays a video with correctly initialized and synced audio and ASCII video.
    """
    if not os.path.exists(video_path):
        print(f"Error: Video file '{video_path}' not found.")
        return
        
    temp_audio_file = "temp_audio.wav"
    cap = None # Define cap here to ensure it's available in the finally block
    
    try:
        print("Extracting audio... please wait.")
        video_clip = VideoFileClip(video_path)
        video_fps = video_clip.fps
        video_clip.audio.write_audiofile(temp_audio_file, codec='pcm_s16le')
        video_clip.close()
        pygame.init()
        pygame.mixer.init()
        pygame.mixer.music.load(temp_audio_file)
        pygame.mixer.music.play()
        cap = cv2.VideoCapture(video_path)
        frame_count = 0
        time.sleep(0.1)  
        
        while True:
            start_time = time.time()
            
            ret, frame = cap.read()
            if not ret:
                break
            audio_time = pygame.mixer.music.get_pos() / 1000.0
            video_time = frame_count / video_fps
            if video_time < audio_time:
                pass # Don't sleep, we're behind
            else:
                sleep_duration = video_time - audio_time
                if sleep_duration > 0:
                    time.sleep(sleep_duration)

            terminal_width = os.get_terminal_size().columns
            
            padding_size = (terminal_width - width) // 2
            padding = ' ' * padding_size if padding_size > 0 else ''
            
            ascii_art = convert_frame_to_ascii(frame, width)
            
            centered_output = "\n".join([f"{padding}{line}" for line in ascii_art.split('\n')])

            os.system('cls' if os.name == 'nt' else 'clear')
            print(centered_output, end='', flush=True)
            
            frame_count += 1
            
    except KeyboardInterrupt:
        print("\nVideo playback interrupted.")
    finally:
        print("Cleaning up...")
        if cap is not None and cap.isOpened():
            cap.release()
        
        if pygame.mixer.get_init():
            pygame.mixer.music.stop()
            pygame.mixer.quit()

        if os.path.exists(temp_audio_file):
            os.remove(temp_audio_file)

if __name__ == "__main__":
    video_path = input("Enter the path to the video file: ").strip()
    
    try:
        width = int(input("Enter terminal width (default 80): ") or "80")
    except ValueError:
        width = 80
    
    play_video_in_terminal(video_path, width)