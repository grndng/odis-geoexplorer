'use client'

import React, { useState, useEffect } from 'react'

import { DatasetInfoExtended } from '@/components/DatasetInfoExtended'
import { SimilarityRating } from '@/components/SimilarityRating'

function parseEmbeddingContent(text) {
  text = text.replaceAll('\\', '')
  const splitted = text.split('$$$\n')

  const parsedInfo = {}
  splitted.map((d, i) => {
    let key
    let value

    if (i === 0) {
      key = 'Titel'
      value = d.split('Titel: ')[1]
    } else {
      key = d.split(': ')[0].replace('*   ', '').trim()
      value = d
        .replace(key + ': ', '')
        .replace('*   ', '')
        .trim()
    }
    if (key === 'Attribute' || key === 'Attribute Beschreibung') {
      value = value.split(',')
      value = value.filter((value, index, self) => {
        return self.indexOf(value) === index
      })
    }
    parsedInfo[key] = value
  })

  return parsedInfo
}

export function DatasetInfoRow(props) {
  const { result, inputText, typeFilterValue, setSimilarSearchText, scatterPlotData } = props

  const [showExtraInfo, setShowExtraInfo] = useState<boolean>(false)
  let content = result && result.content ? parseEmbeddingContent(result.content) : {}
  // content['rawContent'] = result.content
  content['slug'] = result.slug

  // Return the JSX for your component
  return (
    <>
      {typeFilterValue.includes(content['Typ']) && (
        <li className={showExtraInfo ? 'bg-odis-extra-light' : ''}>
          <div key={result.id} className="flex">
            <div className="flex basis-3/5 m-4">
              <div className=" font-bold  border !border-odis-dark rounded-full p-1 px-2 h-max mr-4 self-center text-xs">
                {content['Typ']}
              </div>
              <span className="">
                {content['Titel'].replace(' - \\[WMS]', '').replace(' - \\[WFS]', '')}
              </span>
            </div>
            <div className="m-4 basis-1/5">
              <SimilarityRating similarity={result.similarity}></SimilarityRating>
            </div>
            <div className="m-4 basis-1/5">
              <button
                onClick={() => {
                  setShowExtraInfo(!showExtraInfo)
                }}
                type="submit"
                className="text-white text-xs  rounded-md w-24 px-1 py-1 hover:bg-active bg-odis-light hover:text-odis-dark"
              >
                {showExtraInfo ? 'Weniger Infos' : 'Mehr Infos'}
              </button>
            </div>
          </div>

          {showExtraInfo && (
            <div>
              <div className="">
                <DatasetInfoExtended
                  contentDataset={content}
                  inputText={inputText}
                  setSimilarSearchText={setSimilarSearchText}
                  scatterPlotData={scatterPlotData}
                />
              </div>
            </div>
          )}
          <div className="border-b-[1px]"></div>
        </li>
      )}
    </>
  )
}
