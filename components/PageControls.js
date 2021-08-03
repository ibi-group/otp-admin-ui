import { Sync } from '@styled-icons/fa-solid/Sync'
import { Button, Pagination } from 'react-bootstrap'

function CurrentPage ({responseList}) {
  const {data, offset, total} = responseList
  return (
    <span>
      Showing {offset + 1} - {offset + data.length} of {total}
    </span>
  )
}

function PageControls ({ limit, offset, result, setOffset, showSkipButtons = false, url }) {
  const { data: swrData = {}, error, isValidating, mutate } = result
  const { data: responseList } = swrData
  const hasRecords = responseList?.data?.length > 0
  const lastOffset = hasRecords ? responseList.total - (responseList.total % limit) : 0
  const pageIndex = (offset / limit) + 1
  const onFirstPage = offset <= 0
  const onLastPage = offset === lastOffset
  const firstIndex = onFirstPage ? 1 : onLastPage ? pageIndex - 2 : pageIndex - 1
  const indices = Array(3).fill(firstIndex)
  return (
    <>
      <div className='controls'>
        <span>
          <Button disabled={isValidating} onClick={() => mutate()}>
            <Sync size={20} />
          </Button>
          {hasRecords && <CurrentPage responseList={responseList} />}
        </span>
        <Pagination className='float-right'>
          <Pagination.First disabled={onFirstPage} onClick={() => setOffset(0)} />
          <Pagination.Prev disabled={onFirstPage} onClick={() => setOffset(offset - limit)} />
          {indices.map((value, i) => {
            const itemIndex = value + i
            const newOffset = (itemIndex - 1) * limit
            if (newOffset > lastOffset || newOffset < 0) return null
            return (
              <Pagination.Item
                key={i}
                active={itemIndex === pageIndex}
                onClick={() => setOffset(newOffset)}
              >
                {itemIndex}
              </Pagination.Item>
            )
          })}
          <Pagination.Next disabled={onLastPage} onClick={() => setOffset(offset + limit)} />
          <Pagination.Last disabled={onLastPage} onClick={() => setOffset(lastOffset)} />
        </Pagination>
      </div>
      <div className='mt-3'>
        {error && <pre>Error loading items: {error}</pre>}
      </div>
      <style jsx>{`
        .controls :global(.btn) {
          margin-right: 1rem;
        }
      `}
      </style>
    </>
  )
}

export default PageControls
