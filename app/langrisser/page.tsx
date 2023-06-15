"use client"

import "pixi-spine"
import React, { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { db } from "@/db/db"
import { Spine } from "@/local_modules/pixi-spine"
import { atlasSchema } from "@/schema/atlas-schema"
import { imageSchema } from "@/schema/image-schema"
import { jsonSchema } from "@/schema/json-schema"
import { SkelToJson } from "@/utils/converter/skelToJson"
import { fetchFiles } from "@/utils/fetcher"
import { readFileAsDataURL } from "@/utils/read-data-url"
import { useQuery } from "@tanstack/react-query"
import { Assets } from "pixi.js"
import * as prettier from "prettier"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ComboBox } from "@/components/combobox"
import useSpine from "@/components/use-spine"

type SpineUrls = {
  imageUrl?: string | null
  skelUrl?: string | null
  atlasUrl?: string | null
}
interface Files {
  atlas?: string | undefined
  png?: string | undefined
  skel?: string | undefined
}

interface Skin {
  complete: boolean
  files: Files
}

interface CharEntry {
  [skin: string]: Skin
}

interface DB {
  char: Record<string, CharEntry>
}

export default function IndexPage() {
  const charRef = useRef<{ png?: string; atlas?: string; skel?: string }>()
  const currentCharRef = useRef<{
    selectedChar: string
    selectedSkin: string
    availableSkins: string[]
  }>()
  const {
    render,
    init,
    animationList,
    playAnimation,
    spineAnimation,
    toggleDebugMode,
  } = useSpine()
  const { toast } = useToast()
  const setBlob = async ({ atlasUrl, imageUrl, skelUrl }: SpineUrls) => {
    if (!atlasUrl || !imageUrl || !skelUrl) return
    const manifest = {
      bundles: [
        {
          name: "spineAnimation",
          assets: [
            {
              name: "spineAnimation",
              srcs: skelUrl,
              data: {
                image: imageUrl,
                spineAtlasFile: atlasUrl,
              },
            },
          ],
        },
      ],
    }
    Assets.reset()

    try {
      await Assets.init({ manifest })
      const assetBundle = await Assets.loadBundle("spineAnimation")
      const spineToConvert = new Spine(assetBundle.spineAnimation.spineData)
      const jsonToConvert = new SkelToJson(spineToConvert)
      const jsonString = jsonToConvert.toJSON()
      const encodedJsonString = encodeURIComponent(jsonString)

      const loader = await Assets.load({
        src: `data:application/json;charset=utf-8,${encodedJsonString}`,
        data: {
          image: imageUrl,
          spineAtlasFile: atlasUrl,
        },
      })
      const spine = new Spine(loader.spineData)
      init(spine)
    } catch (error) {
      console.log("🚀 ~ file: page.tsx:109 ~ IndexPage ~ error:", error)
      toast({
        title: "Error loading Spine data",
        description: "Make sure your Skel version is 3.3 or 3.4",
      })
    }
  }
  const { refetch } = useQuery(
    ["langrisser"],
    () => fetchFiles(charRef.current),
    {
      enabled: !!charRef.current,
      onSuccess: setBlob,
    }
  )

  const handleCharacterComboBoxChange = useCallback(
    (index: string) => {
      const chars = Object.keys(db.char)
      const selectedChar = chars[parseInt(index)]
      const skins = Object.keys((db.char as DB["char"])[selectedChar])
      const filteredSkins = skins.filter(
        (skin) =>
          (db.char as Record<string, CharEntry>)[selectedChar][skin].complete
      )

      if (filteredSkins[0] !== undefined) {
        const { atlas, png, skel } = (db.char as Record<string, CharEntry>)[
          selectedChar
        ][filteredSkins[0]].files

        const currentChar = { atlas, png, skel }
        charRef.current = currentChar
        currentCharRef.current = {
          selectedChar,
          selectedSkin: filteredSkins[0],
          availableSkins: filteredSkins,
        }
      }

      refetch()
    },
    [refetch]
  )
  const handleSkinComboBoxChange = useCallback(
    (index: string) => {
      if (!currentCharRef.current) return
      const charData = (db.char as Record<string, CharEntry>)[
        currentCharRef.current.selectedChar
      ][currentCharRef.current.availableSkins[parseInt(index)]].files

      if (charData !== undefined) {
        const { atlas, png, skel } = charData

        const currentChar = { atlas, png, skel }
        charRef.current = currentChar
        currentCharRef.current = {
          ...currentCharRef.current,
          selectedSkin: currentCharRef.current.availableSkins[parseInt(index)],
        }
      }

      refetch()
    },
    [refetch]
  )

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-5">
      <div className="mx-auto flex w-full max-w-[980px] flex-col items-start gap-2">
        <h1 className="self-center text-center font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Langrisser Spine Previewer
        </h1>
      </div>
      <div className="flex w-full flex-col items-center gap-2 md:px-6">
        <div className="flex w-full flex-col items-start gap-2">
          <Label>Character list:</Label>
          <ComboBox
            searchText="Search by character name"
            selectText="Select a character"
            notFoundText="No characters found"
            data={Object.keys(db.char).map((char, i) => ({
              value: i.toString(),
              label: char,
            }))}
            onChange={(data) => handleCharacterComboBoxChange(data.value)}
          />
          <Label>Skin list:</Label>
          <ComboBox
            disabledText="Load a Spine file"
            searchText="Search by animation name"
            selectText="Select an animation"
            notFoundText="No animations found"
            data={currentCharRef.current?.availableSkins.map((skin, i) => ({
              value: i.toString(),
              label: skin,
            }))}
            onChange={(data) => handleSkinComboBoxChange(data.value)}
          />
          <Label>Spine animation list:</Label>
          <ComboBox
            disabledText="Load a character first"
            searchText="Search by skin name"
            selectText="Select a skin"
            notFoundText="No skins found"
            data={animationList?.map((animation, i) => ({
              value: i.toString(),
              label: animation.name,
            }))}
            onChange={(index) => playAnimation(parseInt(index.value))}
          />
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:gap-6">
            <Button
              disabled={!animationList}
              className="w-full"
              onClick={() => {
                if (spineAnimation) spineAnimation.state.timeScale = 1
              }}
            >
              Play
            </Button>
            <Button
              disabled={!animationList}
              className="w-full"
              onClick={() => {
                if (spineAnimation) spineAnimation.state.timeScale = 0
              }}
              variant="secondary"
            >
              Pause
            </Button>
            <Button
              disabled={!animationList}
              className="w-full"
              onClick={() => {
                toggleDebugMode()
              }}
              variant="outline"
            >
              Toggle Debug Mode
            </Button>
          </div>
        </div>

        {render}
      </div>
    </section>
  )
}
