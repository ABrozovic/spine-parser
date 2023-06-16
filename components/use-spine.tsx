import React, { useEffect, useRef, useState } from "react"
import { useGesture } from "@use-gesture/react"
import { IAnimation, ITimeline, Spine, SpineDebugRenderer } from "pixi-spine"
import * as PIXI from "pixi.js"

const roundUpToEven = (num: number, decimalPlaces: number): number => {
  const factor = Math.pow(10, decimalPlaces)
  const roundedNum = Math.ceil(num * factor)
  return roundedNum % 2 === 1 ? (roundedNum + 1) / factor : roundedNum / factor
}
export type UseSpine = {
  init: (spine: Spine) => void
  animationList: IAnimation<ITimeline>[] | undefined
  playAnimation: (index: number) => void
  toggleDebugMode: () => void
  spineAnimation: Spine | null | undefined
  position: PIXI.ObservablePoint<any> | undefined
  scale: PIXI.ObservablePoint<any> | undefined
  render: React.JSX.Element
}
const useSpine = (): UseSpine => {
  const [canvasState, setCanvasState] = useState<HTMLCanvasElement | null>(null)
  const [animationList, setAnimationList] = useState<
    IAnimation<ITimeline>[] | undefined
  >()
  const appRef = useRef<PIXI.Application<PIXI.ICanvas> | null>(null)
  const spineAnimationRef = useRef<Spine | undefined | null>()
  const debugModeRef = useRef(false)
  const dragTarget = useRef<PIXI.DisplayObject | undefined | null>()

  const bindGestures = useGesture({
    onWheel: ({ _delta }) => {
      onWheel(_delta[1])
    },
    onPinch: ({ offset: [s] }) => {
      const currentScale = spineAnimationRef.current?.scale.x ?? 0
      const modifier = s > 0 ? 0.7 : 1.7
      setAnimationScale(currentScale * modifier)
    },
    onDrag: ({ delta, dragging }) => {
      if (dragTarget.current) {
        dragTarget.current.position.set(
          dragTarget.current.position.x + delta[0],
          dragTarget.current.position.y + delta[1]
        )
      }
      if (!dragging) dragTarget.current = null
    },
  })

  useEffect(() => {
    if (canvasState) {
      appRef.current = new PIXI.Application({
        height: canvasState.height * 5,
        width: canvasState.width * 5,
        view: canvasState,
        resolution: window.devicePixelRatio,
      })

      const preventDefaultWheel = (wheel: WheelEvent) => wheel.preventDefault()
      canvasState.addEventListener("wheel", preventDefaultWheel, {
        passive: false,
      })

      appRef.current.stage.eventMode = "dynamic"
      appRef.current.stage.hitArea = appRef.current.screen
    }
  }, [canvasState])

  const onWheel = (deltaY: number) => {
    const currentScale = spineAnimationRef.current?.scale.x ?? 0
    const modifier = deltaY > 0 ? 0.7 : 1.7
    setAnimationScale(currentScale * modifier)
  }

  const onPointerDown = () => {
    const stage = appRef.current?.stage
    if (stage) {
      dragTarget.current = appRef.current?.stage.children[0]
    }
  }

  const removeCurrentAnimation = () => {
    if (!spineAnimationRef.current) return
    appRef.current?.stage.removeChildren()
    spineAnimationRef.current = null
  }
  const init = (spine: Spine) => {
    if (!canvasState || !appRef.current) return
    removeCurrentAnimation()
    spineAnimationRef.current = spine
    const bounds = spine?.getBounds()
    const initialScale = roundUpToEven(calculateInitialScale(bounds.height), 2)

    setAnimationScale(initialScale)
    setAnimationPosition(
      // @ts-expect-error
      Math.round(appRef.current.stage.hitArea.width * 0.5),
      // @ts-expect-error
      appRef.current.stage.hitArea.bottom
    )

    setAnimationList(spineAnimationRef.current?.spineData.animations)
    setSpineInstance(spine)
  }

  const calculateInitialScale = (animationHeight: number) => {
    const canvasHeight = canvasState?.height ?? animationHeight
    return (canvasHeight / animationHeight) * 0.5
  }

  const setAnimationScale = (scale: number) => {
    const animationSpeed = 0.05
    const spineAnimation = spineAnimationRef.current

    if (spineAnimation) {
      const currentScale = spineAnimation.scale.x
      const targetScale = scale

      const deltaScale = (targetScale - currentScale) * animationSpeed
      const newScale = currentScale + deltaScale

      spineAnimation.scale.set(newScale)

      if (Math.abs(deltaScale) > 0.001) {
        requestAnimationFrame(() => setAnimationScale(scale))
      }
    }
  }

  const setAnimationPosition = (x: number, y: number) => {
    spineAnimationRef.current?.position.set(x, y)
  }

  const toggleDebugMode = () => {
    if (!spineAnimationRef.current) return
    debugModeRef.current = !debugModeRef.current
    // @ts-expect-error
    spineAnimationRef.current.debug = debugModeRef.current
      ? new SpineDebugRenderer()
      : null
  }

  const setSpineInstance = (spine: Spine) => {
    appRef.current?.stage.addChild(spine)
    spine.eventMode = "dynamic"
    spine.cursor = "pointer"
    spine.on("pointerdown", onPointerDown, spine)
  }

  const playAnimation = (index: number) => {
    const animation = spineAnimationRef.current?.spineData.animations[index]
    if (!animation) return
    spineAnimationRef.current?.state.setAnimation(0, animation.name, true)
  }

  const MemoizedRenderComponent = React.memo<{
    canvasState: HTMLCanvasElement | null
  }>(
    () => (
      <canvas {...bindGestures()} className="w-full" ref={setCanvasState} />
    ),
    (prevProps, nextProps) => prevProps.canvasState === nextProps.canvasState
  )
  MemoizedRenderComponent.displayName = "PixiSpinePlayer"

  return {
    init,
    animationList,
    playAnimation,
    toggleDebugMode,
    spineAnimation: spineAnimationRef.current,
    position: spineAnimationRef.current?.position,
    scale: spineAnimationRef.current?.scale,
    render: (
      <canvas {...bindGestures()} className="w-full" ref={setCanvasState} />
    ),
  }
}

export default useSpine
