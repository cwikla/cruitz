Rails.application.routes.draw do

  scope :api, defaults: { format: :json } do
    scope :v1 do
      get 'users/me' => 'users#me'
      get 'recruiters' => 'users#recruiters'
      get 'recruiter' => 'users#recruiter'
      get 'candidates/:id/thread' => 'candidates#thread'

      resources :users, only: [:index, :create, :show, :update, :destroy]

        #resources :microposts, only: [:index, :create, :show, :update, :destroy]

      get 'jobs/location' => 'jobs#lsearch'
      get 'jobs/:id(/:candidates)' => 'jobs#show'

      resources :ratings
      resources :companies
      resources :candidates
      resources :heads
      resources :jobs

      post 'messages/:id' => 'messages#create'
      resources :messages
    end
  end

  get 'pricing' => 'home#pricing'
  get 'about' => 'home#about'
  get 'recruit' => 'home#recruiters'


  authenticated :user do
    root 'dashboard#index'
    match "*path", to: redirect('/'), via: :all
  end

end
