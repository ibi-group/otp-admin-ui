import { Sync } from '@styled-icons/fa-solid/Sync'
import { Button, Pagination } from 'react-bootstrap'

function PageControls ({ limit, offset, result, setOffset, showSkipButtons = false, url }) {
  const { data: records, error, isValidating, mutate } = result
  const hasRecords = records && records.data && records.data.length > 0
  const lastOffset = hasRecords ? records.total - (records.total % limit) : 0
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
          {hasRecords &&
            <span>
              Showing {records.offset + 1} - {records.offset + records.data.length} of {records.total}
            </span>
          }
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
