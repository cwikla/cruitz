class ApplicationController < Pyr::Base::ApplicationController
  protect_from_forgery with: :exception
end
