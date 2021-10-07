{ pkgs ? import <nixpkgs> { } }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    flac
    python3Packages.python
    python3Packages.mutagen
    awscli
    deno
  ];

  shellHook = ''
    lume() {
      deno run --unstable -A https://deno.land/x/lume@v1.1.0/ci.ts "$@"
    }
  '';
}
