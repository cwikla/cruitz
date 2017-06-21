Rails.application.routes.draw do

  get 'jobs/location' => 'jobs#lsearch'

  resources :ratings
  resources :companies
  resources :candidates
  resources :heads
  resources :jobs
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
