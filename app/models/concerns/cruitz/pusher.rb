module Cruitz
  module Pusher
    extend ActiveSupport::Concern
  
    included do
    end
  
    module ClassMethods
      def pusher_client
        @@pusher_client ||= ::Pusher::Client.new(
          app_id: ::PUSHER_APP_ID,
          key: ::PUSHER_KEY,
          secret: ::PUSHER_SECRET,
          cluster: ::PUSHER_CLUSTER,
          logger: ::PUSHER_LOGGER,
          encrypted: ::PUSHER_ENCRYPTED
        )
      end
  
    end
  
    def private_channel
      "private-" + self.uuid
    end
  
    def pusher_event(eventName, **data)
      self.class.pusher_client.trigger(self.private_channel, eventName, **data)
    end
  end
end
