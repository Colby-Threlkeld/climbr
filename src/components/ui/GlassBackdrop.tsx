import { BlurTargetView } from 'expo-blur';
import { createContext, useContext, useRef, type ComponentRef, type RefObject } from 'react';
import { View, type ViewProps } from 'react-native';

type TargetRef = RefObject<ComponentRef<typeof View> | null>;

const BackdropContext = createContext<TargetRef | null>(null);

// Android can only blur content it's explicitly told about. Wrap the photo/video that sits
// behind glass in <GlassBackdrop>, and put the glass controls inside it too. On iOS and web
// this is a plain View (those platforms blur whatever is behind automatically).
export function GlassBackdrop({ children, ...rest }: ViewProps) {
  const ref = useRef<ComponentRef<typeof View>>(null);
  return (
    <BackdropContext.Provider value={ref}>
      <BlurTargetView ref={ref} {...rest}>
        {children}
      </BlurTargetView>
    </BackdropContext.Provider>
  );
}

export function useGlassBackdrop(): TargetRef | null {
  return useContext(BackdropContext);
}
