worker_processes 1 # amount of unicorn workers to spin up
                   # increasing this, within reason, can improve performance
timeout 30         # restarts workers that hang for 30 seconds

# LazyWorkQueue allows this to work correctly
# HMMMMMMMM
preload_app true

before_fork do |server, worker|
  # Replace with MongoDB or whatever
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.connection.disconnect!
    Rails.logger.info('Disconnected from ActiveRecord')
  end
end

after_fork do |server, worker|
  # Replace with MongoDB or whatever
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.establish_connection
    Rails.logger.info('Connected to ActiveRecord')
  end
end

