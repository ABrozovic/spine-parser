"use client"

import "pixi-spine"
import React, { useRef, useState } from "react"
import { Spine } from "@/local_modules/pixi-spine"
import { atlasSchema } from "@/schema/atlas-schema"
import { imageSchema } from "@/schema/image-schema"
import { jsonSchema } from "@/schema/json-schema"
import { SkelToJson } from "@/utils/converter/skelToJson"
import { readFileAsDataURL } from "@/utils/read-data-url"
import { Assets } from "pixi.js"

import { cn, getFileExtension } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ComboBox } from "@/components/combobox"
import Dropzone from "@/components/dropzone"
import { SpineControlButtons } from "@/components/spine-control-buttons"
import useSpine from "@/components/use-spine"

type SpineUrls = {
  imageUrl?: string | null
  skelUrl?: string | null
  atlasUrl?: string | null
}

export default function IndexPage() {
  const spineUrlRef = useRef<SpineUrls>()
  const [jsonDownload, setJsonDownload] = useState("")
  const pixiData = useSpine()
  const { render, init, animationList, playAnimation } = pixiData
  const { toast } = useToast()
  const setBlob = async ({
    atlasUrl = spineUrlRef.current?.atlasUrl,
    imageUrl = spineUrlRef.current?.imageUrl,
    skelUrl = spineUrlRef.current?.skelUrl,
  }: SpineUrls) => {
    spineUrlRef.current = { atlasUrl, imageUrl, skelUrl: skelUrl }
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
      setJsonDownload(jsonString)
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
      console.log(error)
      toast({
        title: "Error loading Spine data",
        description: "Make sure your Skel version is 3.3 or 3.4",
      })
    }
  }

  const handleFilesChanged = async <T extends { file: File }>(
    files: T[],
    propertyName: keyof SpineUrls
  ) => {
    let file = files[0]?.file
    if (file) {
      let dataUrl = await readFileAsDataURL(file)
      dataUrl =
        getFileExtension(file.name) === "skel" ? dataUrl + ".skel" : dataUrl
      setBlob({ [propertyName]: dataUrl })
    } else {
      setBlob({ [propertyName]: null })
    }
  }

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-5">
      <div className="mx-auto flex w-full max-w-[980px] flex-col items-start gap-2">
        <h1 className="self-center text-center font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          3.3-3.4 to 3.8 Converter
        </h1>
        <div className="flex w-full flex-1 flex-col justify-between sm:flex-row sm:gap-2">
          <Dropzone
            className="flex flex-1 flex-col sm:max-w-[30%]"
            onFilesChanged={(files) => handleFilesChanged(files, "atlasUrl")}
            acceptedMimeTypes={["application/octet-stream"]}
            validator={(files) => atlasSchema.parse(files)}
            acceptAll
            multiple={false}
            maxFiles={1}
          >
            {({
              maxFilesReached,
              isDragAccept: isFocused,
              files,
              handleRemove,
            }) => (
              <div
                className={`${cn(
                  `mt-2 flex  flex-1 cursor-pointer flex-col items-center  justify-center border-2 border-dashed border-gray-500 p-8 text-center sm:min-h-[200px]`,
                  isFocused && "border-blue-500"
                )}`}
              >
                <p className="overflow-hidden text-ellipsis whitespace-pre-line">{`${
                  maxFilesReached
                    ? `${files[0] && `${files[0]?.file.name}`}`
                    : `Drop a .atlas file`
                }`}</p>
                {maxFilesReached && (
                  <button
                    className="pointer-events-auto z-50"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(0)
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </Dropzone>
          <Dropzone
            className="flex flex-1 flex-col sm:max-w-[30%]"
            onFilesChanged={(files) => handleFilesChanged(files, "imageUrl")}
            acceptedMimeTypes={["image/jpeg", "image/png"]}
            validator={(files) => imageSchema.parse(files)}
            acceptAll
            multiple={false}
            maxFiles={1}
          >
            {({
              maxFilesReached,
              isDragAccept: isFocused,
              files,
              handleRemove,
            }) => (
              <div
                className={`${cn(
                  `mt-2 flex  flex-1 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-gray-500 p-8 text-center sm:min-h-[200px]`,
                  isFocused && "border-blue-500"
                )}`}
              >
                <p className="overflow-hidden text-ellipsis whitespace-pre-line">{`${
                  maxFilesReached
                    ? `${files[0] && `${files[0]?.file.name}`}`
                    : `Drop a \n .png/jpeg file`
                }`}</p>
                {maxFilesReached && (
                  <button
                    className="pointer-events-auto z-50"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(0)
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </Dropzone>
          <Dropzone
            className="flex flex-1 flex-col sm:max-w-[30%]"
            onFilesChanged={(files) => handleFilesChanged(files, "skelUrl")}
            validator={(files) => jsonSchema.parse(files)}
            acceptAll
            multiple={false}
            maxFiles={1}
          >
            {({
              maxFilesReached,
              isDragAccept: isFocused,
              files,
              handleRemove,
            }) => (
              <div
                className={`${cn(
                  `mt-2 flex  flex-1 cursor-pointer flex-col items-center justify-center border-2 border-dashed border-gray-500 p-8 text-center sm:min-h-[200px]`,
                  isFocused && "border-blue-500"
                )}`}
              >
                <p className="overflow-hidden text-ellipsis whitespace-pre-line">{`${
                  maxFilesReached
                    ? `${files[0] && `${files[0]?.file.name}`}`
                    : `Drop a .skel file`
                }`}</p>
                {maxFilesReached && (
                  <button
                    className="pointer-events-auto z-50"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(0)
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </Dropzone>
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2 md:px-6">
        <div className="flex w-full flex-col items-start gap-2">
          <Label>Spine animation list:</Label>
          <ComboBox
            disabledText="Load a Spine file"
            searchText="Search by animation name"
            selectText="Select an animation"
            notFoundText="No animations found"
            data={animationList?.map((animation, i) => ({
              value: i.toString(),
              label: animation.name,
            }))}
            onChange={(index) => playAnimation(parseInt(index.value))}
          />
          <SpineControlButtons pixiData={pixiData}>
            <Button
              disabled={!jsonDownload}
              className="w-full"
              onClick={() => {
                const blob = new Blob([jsonDownload], {
                  type: "application/json",
                })
                const href = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = href
                link.download = "convertedJson"
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }}
              variant="outline"
            >
              Download Json
            </Button>
          </SpineControlButtons>
        </div>

        {render}
      </div>
    </section>
  )
}
