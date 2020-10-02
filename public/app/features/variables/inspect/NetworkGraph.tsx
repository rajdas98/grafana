import React, { FC, useCallback, useEffect } from 'react';
// @ts-ignore
import vis from 'visjs-network';
import { GraphEdge, GraphNode, toVisNetworkEdges, toVisNetworkNodes } from './utils';

interface OwnProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  width: string;
  height: string;
  direction?: 'UD' | 'DU' | 'LR' | 'RL';
  onDoubleClick?: (node: string) => void;
}

interface ConnectedProps {}

interface DispatchProps {}

type Props = OwnProps & ConnectedProps & DispatchProps;

export const NetWorkGraph: FC<Props> = ({ nodes, edges, direction, width, height, onDoubleClick }) => {
  let network: any = null;
  let ref: any = null;

  const onNodeDoubleClick = useCallback(
    (params: { nodes: string[] }) => {
      if (onDoubleClick) {
        onDoubleClick(params.nodes[0]);
      }
    },
    [onDoubleClick]
  );

  useEffect(() => {
    if (!ref) {
      return;
    }

    const data = {
      nodes: toVisNetworkNodes(nodes),
      edges: toVisNetworkEdges(edges),
    };

    const options = {
      width: '100%',
      height: '100%',
      autoResize: true,
      layout: {
        improvedLayout: true,
        hierarchical: {
          enabled: true,
          direction: direction ?? 'DU',
          sortMethod: 'directed',
        },
      },
      interaction: {
        dragNodes: false,
        // dragView: false,
      },
    };

    network = new vis.Network(ref, data, options);
    network.on('doubleClick', onNodeDoubleClick);

    return () => {
      // unsubscribe event handlers
      if (network) {
        network.off('doubleClick');
      }
    };
  }, []);

  return <div ref={r => (ref = r)} style={{ width, height }} />;
};
