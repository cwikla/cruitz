
Rails.application.routes.draw do

  resources :categories
  scope :api, defaults: { format: :json } do
    scope :v1 do
      get 'users/me' => 'users#me'
      get 'recruiters' => 'users#recruiters'
      get 'recruiters/:id' => 'users#recruiter'
      get 'candidates/:id/thread' => 'candidates#thread'

      resources :users, only: [:index, :create, :show, :update, :destroy]

        #resources :microposts, only: [:index, :create, :show, :update, :destroy]

      get 'jobs/location' => 'jobs#lsearch'
      get 'jobs/:id(/:candidates)' => 'jobs#show'

      get 'settings' => 'settings#show'
      put 'settings' => 'settings#update'

      post 'search(/:model)' => 'search#show'
      get 'search(/:model)' => 'search#show'

      get 'upload_url' => 'uploads#get', as: :api_v1_upload_url

      resources :ratings
      resource :company
      resources :candidates
      resources :heads
      resources :jobs
      resources :invites, only: [:new, :create]

      post 'messages/:id' => 'messages#create'
      resources :messages
    end
  end

  get 'pricing' => 'home#pricing'
  get 'about' => 'home#about'
  get 'recruit' => 'home#recruiters'


  authenticated :user do
    root 'dashboard#index'
    #match "*path", to: redirect('/'), via: :all
  end


end
