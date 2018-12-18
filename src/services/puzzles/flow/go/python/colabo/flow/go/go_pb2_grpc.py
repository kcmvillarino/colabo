# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
import grpc

from colabo.flow.go import go_pb2 as colabo_dot_flow_dot_go_dot_go__pb2


class ActionsHostStub(object):
  # missing associated documentation comment in .proto file
  pass

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.executeAction = channel.unary_unary(
        '/colabo.flow.ActionsHost/executeAction',
        request_serializer=colabo_dot_flow_dot_go_dot_go__pb2.ActionExecuteRequest.SerializeToString,
        response_deserializer=colabo_dot_flow_dot_go_dot_go__pb2.ActionExecuteReply.FromString,
        )


class ActionsHostServicer(object):
  # missing associated documentation comment in .proto file
  pass

  def executeAction(self, request, context):
    """rpc checkAction (ActionExecuteRequest) returns (ActionExecuteReply) {}
    """
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_ActionsHostServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'executeAction': grpc.unary_unary_rpc_method_handler(
          servicer.executeAction,
          request_deserializer=colabo_dot_flow_dot_go_dot_go__pb2.ActionExecuteRequest.FromString,
          response_serializer=colabo_dot_flow_dot_go_dot_go__pb2.ActionExecuteReply.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'colabo.flow.ActionsHost', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))


class FlowsHostStub(object):
  # missing associated documentation comment in .proto file
  pass

  def __init__(self, channel):
    """Constructor.

    Args:
      channel: A grpc.Channel.
    """
    self.startFlowInstance = channel.unary_unary(
        '/colabo.flow.FlowsHost/startFlowInstance',
        request_serializer=colabo_dot_flow_dot_go_dot_go__pb2.FlowInstanceRequest.SerializeToString,
        response_deserializer=colabo_dot_flow_dot_go_dot_go__pb2.FlowInstanceReply.FromString,
        )
    self.executeActionSync = channel.unary_unary(
        '/colabo.flow.FlowsHost/executeActionSync',
        request_serializer=colabo_dot_flow_dot_go_dot_go__pb2.ActionExecuteRequest.SerializeToString,
        response_deserializer=colabo_dot_flow_dot_go_dot_go__pb2.ActionExecuteReply.FromString,
        )


class FlowsHostServicer(object):
  # missing associated documentation comment in .proto file
  pass

  def startFlowInstance(self, request, context):
    """client asks the host to execute (wherever is expected) the action
    """
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def executeActionSync(self, request, context):
    """client asks the host to execute (wherever is expected) the action
    """
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


def add_FlowsHostServicer_to_server(servicer, server):
  rpc_method_handlers = {
      'startFlowInstance': grpc.unary_unary_rpc_method_handler(
          servicer.startFlowInstance,
          request_deserializer=colabo_dot_flow_dot_go_dot_go__pb2.FlowInstanceRequest.FromString,
          response_serializer=colabo_dot_flow_dot_go_dot_go__pb2.FlowInstanceReply.SerializeToString,
      ),
      'executeActionSync': grpc.unary_unary_rpc_method_handler(
          servicer.executeActionSync,
          request_deserializer=colabo_dot_flow_dot_go_dot_go__pb2.ActionExecuteRequest.FromString,
          response_serializer=colabo_dot_flow_dot_go_dot_go__pb2.ActionExecuteReply.SerializeToString,
      ),
  }
  generic_handler = grpc.method_handlers_generic_handler(
      'colabo.flow.FlowsHost', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))