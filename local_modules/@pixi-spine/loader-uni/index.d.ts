/// <reference path="./global.d.ts" />

import {
  IAnimationState,
  IAnimationStateData,
  ISkeleton,
  ISkeletonData,
  SpineBase,
} from "@pixi-spine/base"

/**
 * @public
 */
export declare function detectSpineVersion(version: string): SPINE_VERSION

/**
 * @public
 */
export declare class Spine extends SpineBase<
  ISkeleton,
  ISkeletonData,
  IAnimationState,
  IAnimationStateData
> {
  createSkeleton(spineData: ISkeletonData): void
}

/**
 * @public
 */
export declare enum SPINE_VERSION {
  UNKNOWN = 0,
  VER37 = 37,
  VER38 = 38,
  VER40 = 40,
  VER41 = 41,
}

export {}
