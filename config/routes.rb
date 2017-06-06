Rails.application.routes.draw do

  resources :recruiters
  resources :employers
  resources :ratings
  resources :companies
  resources :agencies
  resources :candidates
  resources :heads
  resources :positions
  #namespace :api, defaults: { format: :json }, constraints: { subdomain: 'api' }, path: '/' do
      #scope module: :v1 do
      #end
  #end

  get 'pricing' => 'home#pricing'
  get 'about' => 'home#about'
  get 'recruiters' => 'home#recruiters'

  authenticated :user do
    root 'dashboard#index'
  end

end
