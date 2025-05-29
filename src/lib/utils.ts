export const formatDuration = (duration: number): string => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const formatSampleRate = (sampleRate: number): string => {
  const sampleRateKHz = sampleRate / 1000;
  return `${sampleRateKHz} Hz`;
};

export const formatTempo = (tempo: number): string => {
  return `${tempo} BPM`;
};

export const formatLoundnessRMS = (loudness: number): string => {
  return `${loudness} dB`;
};

export const formatFileSize = (size: number): string => {
  if (!size) return "0 B";

  if (size < 1024) return `${size} B`;
  else if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  else if (size < 1024 * 1024 * 1024)
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  else return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};
