Rails.application.routes.draw do
  #namespace :api, defaults: { format: :json }, constraints: { subdomain: 'api' }, path: '/' do
      #scope module: :v1 do
      #end
  #end

  get 'pricing' => 'home#pricing'
  get 'about' => 'home#about'
  get 'recruiters' => 'home#recruiters'
end
