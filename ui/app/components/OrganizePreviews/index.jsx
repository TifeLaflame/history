import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { getHostToken } from '../../utils/host';
import { resizeDimensions } from '../../../../config.json';

const CDN_HOST = getHostToken('cdn');

export function DraggableThumb({ item, parentCdnFolder, rootFolder }) {
  const imagePath = rootFolder
    ? `${rootFolder}/${item.filename}`
    : `${CDN_HOST}/${parentCdnFolder}/${item.filename}`;
  return [
    <span key={`label-${item.filename}`}>{item.filename}</span>,
    <img
      key={`thumbnail-${item.filename}`}
      alt="No preview yet"
      src={imagePath}
      width={resizeDimensions.preview.width}
      height={resizeDimensions.preview.height}
    />,
  ];
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  padding: grid,
  width: 314,
});

function OrganizePreviews({ items, setItems }) {
  if (items.length === 0) {
    return null;
  }

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    setItems(reorder(items, result.source.index, result.destination.index));
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(providedDrop, snapshotDrop) => (
          <div
            {...providedDrop.droppableProps}
            ref={providedDrop.innerRef}
            style={getListStyle(snapshotDrop.isDraggingOver)}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(providedDrag, snapshotDrag) => (
                  <div
                    ref={providedDrag.innerRef}
                    {...providedDrag.draggableProps}
                    {...providedDrag.dragHandleProps}
                    style={getItemStyle(
                      snapshotDrag.isDragging,
                      providedDrag.draggableProps.style,
                    )}
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {providedDrop.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default OrganizePreviews;
