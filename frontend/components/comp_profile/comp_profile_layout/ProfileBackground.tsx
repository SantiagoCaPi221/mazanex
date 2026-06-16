interface Props {
  backgroundUrl: string;
  isProfileVisible: boolean;
}

export default function ProfileBackground({
  backgroundUrl,
  isProfileVisible,
}: Props) {
  return (
    <>
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${backgroundUrl})`,
          imageRendering: "pixelated",
        }}
      />

      <div
        className={`fixed inset-0 -z-10 bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-700 pointer-events-none ${
          isProfileVisible ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
